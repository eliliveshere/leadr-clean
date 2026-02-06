import { OpenAI } from 'openai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'placeholder' })

export async function POST(request: Request) {
    console.log("--> ENRICH API CALLED (JSON MODE)")
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const formData = await request.formData()
    const lead_id = formData.get('lead_id') as string

    if (!lead_id) return new NextResponse('Missing lead_id', { status: 400 })

    // 1. Mark as enrichment in progress
    await supabase.from('leads').update({ enrichment_status: 'enriching' }).eq('id', lead_id)

    try {
        // 2. Fetch Lead Data
        const { data: lead } = await supabase.from('leads').select('*').eq('id', lead_id).single()
        if (!lead) throw new Error("Lead not found")

        // 3. Scrape Website Content
        let websiteText = ""
        let socialLinksFound: string[] = []

        const url = lead.website_url || lead.website
        if (url) {
            try {
                let validUrl = url.startsWith('http') ? url : `https://${url}`
                const controller = new AbortController()
                setTimeout(() => controller.abort(), 10000)
                const res = await fetch(validUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Lead2CloseBot/1.0)' },
                    signal: controller.signal
                })
                if (res.ok) {
                    const html = await res.text()
                    const $ = cheerio.load(html)
                    $('script, style').remove()
                    websiteText = $('body').text().slice(0, 8000) // Limit tokens

                    // Extract Social Links
                    $('a').each((_, el) => {
                        const href = $(el).attr('href')
                        if (href && (href.includes('facebook.com') || href.includes('instagram.com') || href.includes('linkedin.com') || href.includes('twitter.com') || href.includes('youtube.com'))) {
                            socialLinksFound.push(href)
                        }
                    })
                }
            } catch (e) {
                console.error("Scrape failed", e)
                websiteText = "Website unreachable."
            }
        }

        // 4. Construct Prompt
        const prompt = `
       You are Anti-Gravity. Your job is to generate a concise, owner-friendly Digital Performance Audit for the Lead2Close app.
       Do NOT use technical jargon or buzzwords. The audience is a local business owner — keep it simple, clear, and credible.
       
       Business: ${lead.business_name}
       City: ${lead.city}
       Category: ${lead.category}
       Google Rating: ${lead.rating} (${lead.review_count} reviews)
       Google Data: ${JSON.stringify(lead.google_working_hours || {})}
       
       Possible Social Links Found: ${socialLinksFound.join(', ')}
       
       Website Content Preview:
       ${websiteText.replace(/\s+/g, ' ').trim()}
       
       Task:
       1. Identify 3-5 "Current Strengths" (High Google rating, 24/7 services, etc).
       2. Identify 3-5 "Critical Gaps" (Contact form hard to find, missing hours, no social visibility, etc).
       3. Extract contact info & social links.
       4. Determine "Monitoring Signals" status.
       5. Write a simple "Impact Analysis" sentence summarizing their score impact.

       RETURN JSON ONLY. Structure:
       {
         "analysis": {
             "business_summary": "Short 1-sentence summary of what they do.",
             "key_strengths": ["Strength 1", "Strength 2", "..."], 
             "weaknesses_or_gaps": ["Gap 1", "Gap 2", "..."],
             "improvement_opportunities": ["Opp 1", "Opp 2"],
             "estimated_tech_savviness": "low|medium|high",
             "impact_analysis": "One sentence summarizing how their score translates to visibility or missed opportunities."
         },
         "contact_info": {
             "emails_found": ["..."],
             "social_platforms": {
                 "facebook": "url or null",
                 "instagram": "url or null",
                 "linkedin": "url or null",
                 "twitter": "url or null",
                 "youtube": "url or null"
             }
         },
         "monitoring_signals": {
             "social_activity_level": "High|Medium|Low|Dormant",
             "website_update_frequency": "dynamic|static",
             "review_freshness": "...",
             "missing_channels": ["..."]
         },
         "outreach_hook": "A personalized single sentence hook for a cold email based on findings."
       }
     `

        // 5. Call OpenAI (JSON Mode)
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-2024-08-06',
            messages: [
                { role: 'system', content: 'You are an expert business analyst. Return valid JSON only.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: "json_object" },
        })

        const content = completion.choices[0].message.content
        const enrichmentData = content ? JSON.parse(content) : null

        console.log("Enrichment Success:", JSON.stringify(enrichmentData, null, 2))

        // 6. Save Result
        await supabase.from('leads').update({
            enrichment_status: 'enriched',
            enrichment_last_at: new Date().toISOString(),
            enrichment_data: enrichmentData
        }).eq('id', lead_id)

    } catch (err: any) {
        console.error("Enrichment API Error:", err)
        await supabase.from('leads').update({
            enrichment_status: 'failed',
        }).eq('id', lead_id)
    }

    return NextResponse.redirect(new URL(`/app/leads/${lead_id}`, request.url))
}

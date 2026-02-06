import { OpenAI } from 'openai'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

// Enrichment Output Schema
const EnrichmentSchema = z.object({
    analysis: z.object({
        business_summary: z.string(),
        target_audience: z.string(),
        key_strengths: z.array(z.string()),
        weaknesses_or_gaps: z.array(z.string()),
        improvement_opportunities: z.array(z.string()),
        estimated_tech_savviness: z.enum(['low', 'medium', 'high']),
    }),
    contact_info: z.object({
        emails_found: z.array(z.string()),
        social_platforms: z.object({
            facebook: z.string().optional(),
            instagram: z.string().optional(),
            linkedin: z.string().optional(),
            twitter: z.string().optional(),
            youtube: z.string().optional(),
        }),
    }),
    monitoring_signals: z.object({
        social_activity_level: z.string().describe("Estimate: High, Medium, Low, or Dormant based on clues"),
        website_update_frequency: z.string().describe("Estimate: dynamic/modern or static/outdated"),
        review_freshness: z.string().describe("Comment on review recency"),
        missing_channels: z.array(z.string()).describe("List major channels they are missing"),
    }),
    outreach_hook: z.string().describe("A personalized single sentence hook for a cold email based on findings."),
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'placeholder' })

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const formData = await request.formData()
    const lead_id = formData.get('lead_id') as string

    if (!lead_id) return new NextResponse('Missing lead_id', { status: 400 })

    // 1. Mark as enriching
    await supabase.from('leads').update({ enrichment_status: 'enriching' }).eq('id', lead_id)

    try {
        // 2. Fetch Lead Data
        const { data: lead } = await supabase.from('leads').select('*').eq('id', lead_id).single()
        if (!lead) throw new Error("Lead not found")

        // 3. Scrape Website Content (Smart)
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

                    // Extract Social Links explicitly for AI
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
       Analyze this business for a B2B service agency (Lead2Close).
       
       Business: ${lead.business_name}
       City: ${lead.city}
       Category: ${lead.category}
       Google Rating: ${lead.rating} (${lead.review_count} reviews)
       Google Data: ${JSON.stringify(lead.google_working_hours || {})}
       
       Possible Social Links Found: ${socialLinksFound.join(', ')}
       
       Website Content Preview:
       ${websiteText.replace(/\s+/g, ' ').trim()}
       
       Task:
       1. Identify strengths and weaknesses.
       2. Confirm social media links and put them in the correct fields.
       3. "Monitoring Signals": Estimate their digital heartbeat. 
          - Are they active on social? (If we found links, assume 'Visible', if links are broken or missing, 'Dormant').
          - Does the site look updated?
       4. Suggest a specific outreach hook.
     `

        // 5. Call OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-2024-08-06',
            messages: [
                { role: 'system', content: 'You are an expert business analyst.' },
                { role: 'user', content: prompt }
            ],
            response_format: zodResponseFormat(EnrichmentSchema, "enrichment_result"),
        })

        const content = completion.choices[0].message.content
        const enrichmentData = content ? JSON.parse(content) : null

        // 6. Save Result
        await supabase.from('leads').update({
            enrichment_status: 'enriched',
            enrichment_last_at: new Date().toISOString(),
            enrichment_data: enrichmentData
        }).eq('id', lead_id)

    } catch (err: any) {
        console.error("Enrichment API Error:", err)
        // Try to save error to DB (assuming we add a column or reuse existing scan_error or just status)
        // For now just mark failed.
        await supabase.from('leads').update({
            enrichment_status: 'failed',
            // If we had an error column we'd use it. I'll rely on logs for now.
        }).eq('id', lead_id)
    }

    return NextResponse.redirect(new URL(`/app/leads/${lead_id}`, request.url))
}

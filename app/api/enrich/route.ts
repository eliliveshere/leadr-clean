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
                const timeoutId = setTimeout(() => controller.abort(), 10000)
                const res = await fetch(validUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Lead2CloseBot/1.0)' },
                    signal: controller.signal
                })
                clearTimeout(timeoutId)

                if (res.ok) {
                    const html = await res.text()
                    const $ = cheerio.load(html)
                    $('script, style').remove()
                    websiteText = $('body').text().slice(0, 8000) // Limit tokens

                    // Extract Social Links form Website
                    $('a').each((_, el) => {
                        const href = $(el).attr('href')
                        if (href) {
                            if (href.includes('facebook.com') || href.includes('instagram.com') || href.includes('linkedin.com') || href.includes('twitter.com') || href.includes('youtube.com')) {
                                socialLinksFound.push(href)
                            }
                        }
                    })
                }
            } catch (e) {
                console.error("Website scrape failed", e)
                websiteText = "Website unreachable."
            }
        }

        // 3.5 Fallback: Search the Web (DuckDuckGo HTML) if data is sparse
        // We search for "Business Name City Socials" to find profiles
        let searchContext = ""
        try {
            const query = `${lead.business_name} ${lead.city} reviews facebook instagram linkedin`
            console.log("Searching web for:", query)

            // Using a public DDG HTML endpoint which is easier to scrape than Google
            const searchRes = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            })

            if (searchRes.ok) {
                const searchHtml = await searchRes.text()
                const $s = cheerio.load(searchHtml)
                const searchResults: string[] = []

                // DDG HTML results are usually in .result__a
                $s('.result__a').each((i: number, el: any) => {
                    if (i > 5) return // Top 5 results
                    const title = $s(el).text()
                    const link = $s(el).attr('href')
                    if (link && !link.includes('duckduckgo.com')) {
                        searchResults.push(`- ${title}: ${link}`)

                        // Capture socials from search results
                        if (link.includes('facebook.com') && !socialLinksFound.some(l => l.includes('facebook'))) socialLinksFound.push(link)
                        if (link.includes('instagram.com') && !socialLinksFound.some(l => l.includes('instagram'))) socialLinksFound.push(link)
                        if (link.includes('linkedin.com') && !socialLinksFound.some(l => l.includes('linkedin'))) socialLinksFound.push(link)
                    }
                })

                searchContext = searchResults.join('\n')
            }
        } catch (e) {
            console.error("Web Search failed", e)
        }

        // 4. Construct Prompt
        const prompt = `
       You are Anti-Gravity. Your job is to analyze this business for two purposes:
       1. Generate a concise, owner-friendly Digital Performance Audit for the web view.
       2. Generate specific data points for a cold email campaign (Instantly.ai).

       **CRITICAL FIRST STEP: CLASSIFY THE BUSINESS**
       Determine if this business is:
       Type A: **Local Service / B2C** (Plumber, Dentist, Restaurant, Retail, Gym)
       Type B: **Professional B2B / Industrial** (Engineering, Manufacturer, Consultant, Law Firm, Wholesaler)

       **APPLY THESE RULES BASED ON CLASSIFICATION:**

       [IF TYPE A - LOCAL B2C]:
       - **Focus:** Google Maps ranking, Reviews quantity, "Open Now" hours, Missed calls, Social activity (IG/FB).
       - **Framing:** "You are losing customers to competitors."
       - **Metric:** Missed revenue / leads.

       [IF TYPE B - PROFESSIONAL B2B]:
       - **Focus:** Trust & Legitimacy, LinkedIn presence, Website clarity, "Ghost Company" signals (broken links, 2019 copyright), Verification.
       - **IGNORE:** Instagram/TikTok, Daily posting, After-hours availability (irrelevant).
       - **Framing:** "You are failing due diligence checks." or "Your referral traffic is bouncing."
       - **Metric:** Reputation / Trust / RFP Win Rate.
       - **Quick Wins:** Focus on LinkedIn completeness, Website trust signals (About Us, Projects), Contact form friction. NOT "post more reels".

       --- 
       
       Business: ${lead.business_name}
       City: ${lead.city}
       Category: ${lead.category}
       Google Rating: ${lead.rating} (${lead.review_count} reviews)
       Google Data: ${JSON.stringify(lead.google_working_hours || {})}
       
       Possible Social Links Found: ${Array.from(new Set(socialLinksFound)).join(', ')}

       Web Search Findings (Reviews/Profiles):
       ${searchContext || "No external search data found."}
       
       Website Content Preview:
       ${websiteText.replace(/\s+/g, ' ').trim()}
       
       ---

       Task 1 (Audit Report):
       1. Identify 3-5 "Current Strengths" (Strictly relevant to their Type).
       2. Identify 3-5 "Critical Gaps" (Strictly relevant to their Type).
       3. Extract contact info & social links.
       4. Determine "Monitoring Signals" status.
       5. Write a simple "Impact Analysis" sentence summarizing their score impact.

       Task 2 (Email Data for Export):
       1. Determine 'primary_service'.
       2. Determine 'primary_conversion_goal' (B2C calls vs B2B inquiries).
       3. Guess 'likely_traffic_source' (B2C Maps vs B2B Referrals/Direct).
       4. Identify 3 specific "Quick Wins".
          - **For B2B:** "Update Copyright Year", "Fix broken LinkedIn link", "Add 'Projects' section", "Make email clickable".
          - **For B2C:** "Sticky mobile call button", "Add hours to Google", "Respond to reviews".
          - **Constraint:** Must be 1-step fixes, observable, no jargon.
       5. Estimate 'estimated_lift' (e.g. "10-20% trust", "15% leads").
       6. Try to find a 'first_name' of an owner.

       RETURN JSON ONLY. Structure:
       {
         "analysis": {
             "business_type": "Local B2C | Professional B2B",
             "business_summary": "Short 1-sentence summary.",
             "key_strengths": ["..."], 
             "weaknesses_or_gaps": ["..."],
             "improvement_opportunities": ["..."],
             "estimated_tech_savviness": "low|medium|high",
             "impact_analysis": "One sentence impact summary."
         },
         "email_data": {
             "primary_service": "...",
             "primary_conversion_goal": "...",
             "likely_traffic_source": "...",
             "quick_wins": ["Win 1", "Win 2", "Win 3"],
             "estimated_lift": "...",
             "found_first_name": "Name or null"
         },
         "contact_info": {
             "emails_found": ["..."],
             "social_platforms": { "facebook": "...", "instagram": "...", "linkedin": "...", "twitter": "..." }
         },
         "monitoring_signals": {
             "social_activity_level": "...",
             "website_update_frequency": "...",
             "review_freshness": "...",
             "missing_channels": ["..."]
         },
         "outreach_hook": "Personalized hook based on their BUSINESS TYPE and GAPS."
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

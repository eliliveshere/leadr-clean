import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface InstantlyLead {
    email: string
    first_name: string
    last_name: string
    company_name: string
    website: string
    custom_variables: Record<string, any>
}

// Helper to push a single lead to Instantly
// Helper to push a single lead to Instantly
async function pushLeadToInstantly(leadData: InstantlyLead, apiKey: string, campaignId?: string) {
    // Detect API Version based on key format
    const isV2 = apiKey.length > 50
    const version = isV2 ? 'v2' : 'v1'

    console.log(`--> Pushing to Instantly (${version}): ${leadData.email} (Campaign: ${campaignId})`)

    // Cleanup internal flags
    const finalLead = { ...leadData }
    if (finalLead.custom_variables) {
        finalLead.custom_variables = { ...finalLead.custom_variables }
        delete finalLead.custom_variables.campaign_id
    }

    try {
        let url = ''
        let options: RequestInit = {}

        if (isV2) {
            // API V2 (Bearer Token)
            // Assuming endpoint is /api/v2/leads
            url = 'https://api.instantly.ai/api/v2/leads'
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    email: finalLead.email,
                    first_name: finalLead.first_name,
                    last_name: finalLead.last_name,
                    company_name: finalLead.company_name,
                    website: finalLead.website,
                    campaign_id: campaignId,
                    skip_if_in_workspace: true,
                    custom_variables: finalLead.custom_variables
                })
            }
        } else {
            // API V1 (Legacy)
            url = 'https://api.instantly.ai/api/v1/lead/add'
            options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: apiKey,
                    campaign_id: campaignId,
                    skip_if_in_workspace: true,
                    leads: [finalLead]
                })
            }
        }

        const response = await fetch(url, options)
        const responseText = await response.text()
        // Log brief response status
        console.log(`Instantly ${version.toUpperCase()} Response (${response.status}):`, responseText.substring(0, 500))

        if (!response.ok) {
            console.error(`Instantly ${version.toUpperCase()} API Failed:`, responseText)
            return false
        }

        return true
    } catch (e) {
        console.error("Instantly Network Error:", e)
        return false
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { lead_ids, campaign_id } = await request.json()

    if (!lead_ids || lead_ids.length === 0) {
        return new NextResponse('No leads selected', { status: 400 })
    }

    // You mentioned the key is INSTANTLY_API_KEY in Vercel
    const rawKey = process.env.INSTANTLY_API_KEY || ''
    const apiKey = rawKey.trim().replace(/^["']|["']$/g, '')

    if (!apiKey) {
        console.error("Server Config Error: Missing INSTANTLY_API_KEY")
        return new NextResponse('Server Config Error: Missing INSTANTLY_API_KEY', { status: 500 })
    }

    console.log(`Instantly API Key Loaded: ${apiKey.substring(0, 4)}... (Length: ${apiKey.length})`)

    // Fetch leads
    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .in('id', lead_ids)

    if (!leads) return new NextResponse('Leads not found', { status: 404 })

    let successCount = 0
    let failureCount = 0

    // Process push
    for (const lead of leads) {
        // Enriched Data
        const enriched = lead.enrichment_data?.email_data || {}
        const quickWins = enriched.quick_wins || []

        // Contact Info (Try to find a valid email)
        let rawEmail = null
        if (lead.enrichment_data?.contact_info?.emails_found?.length > 0) {
            rawEmail = lead.enrichment_data.contact_info.emails_found[0]
        } else if (lead.email) {
            rawEmail = lead.email
        }

        if (!rawEmail) {
            console.warn(`No email found for lead ${lead.business_name}, skipping Instantly push.`)
            failureCount++
            continue
        }

        // Sanitize Email
        const email = rawEmail.toString().trim().toLowerCase().replace('mailto:', '')

        // Prepare Payload
        const payload: InstantlyLead = {
            email: email,
            first_name: enriched.found_first_name || '',
            last_name: '',
            company_name: lead.business_name,
            website: lead.website_url || lead.website || '',
            custom_variables: {
                // The AI variables
                quick_win_1: quickWins[0] || '',
                quick_win_2: quickWins[1] || '',
                quick_win_3: quickWins[2] || '',
                estimated_lift: enriched.estimated_lift || '',
                primary_service: enriched.primary_service || '',

                // Meta
                source: 'Lead2Close'
            }
        }

        const pushed = await pushLeadToInstantly(payload, apiKey, campaign_id)
        if (pushed) {
            successCount++
            // Mark as contacted locally
            await supabase.from('leads').update({ status: 'contacted', last_contacted_at: new Date().toISOString() }).eq('id', lead.id)
        }
        else failureCount++
    }

    return NextResponse.json({
        success: true,
        pushed: successCount,
        failed: failureCount,
        message: `Pushed ${successCount} leads to Instantly`
    })
}

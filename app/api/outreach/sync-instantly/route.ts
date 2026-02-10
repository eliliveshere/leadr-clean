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
    console.log(`--> Pushing to Instantly: ${leadData.email} (Campaign: ${campaignId})`)

    // Cleanup: Remove internal flags from custom_variables if any
    const finalLead = { ...leadData }
    if (finalLead.custom_variables) {
        // Create a clean copy to avoid mutating original if needed
        finalLead.custom_variables = { ...finalLead.custom_variables }
        delete finalLead.custom_variables.campaign_id
    }

    try {
        const body = {
            api_key: apiKey,
            campaign_id: campaignId,
            skip_if_in_workspace: false, // Changed to false for debugging? No, keep true but log result.
            leads: [finalLead]
        }

        const response = await fetch('https://api.instantly.ai/api/v1/lead/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        const responseText = await response.text()
        console.log(`Instantly Response (${response.status}):`, responseText)

        if (!response.ok) {
            console.error("Instantly API Failed:", responseText)
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
    const apiKey = process.env.INSTANTLY_API_KEY
    if (!apiKey) {
        return new NextResponse('Server Config Error: Missing INSTANTLY_API_KEY', { status: 500 })
    }

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
        // Check enrichment emails first, then standard contact field
        let email = null
        if (lead.enrichment_data?.contact_info?.emails_found?.length > 0) {
            email = lead.enrichment_data.contact_info.emails_found[0]
        } else if (lead.email) {
            email = lead.email
        }

        if (!email) {
            console.warn(`No email found for lead ${lead.business_name}, skipping Instantly push.`)
            failureCount++
            continue
        }

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
        if (pushed) successCount++
        else failureCount++
    }

    return NextResponse.json({
        success: true,
        pushed: successCount,
        failed: failureCount,
        message: `Pushed ${successCount} leads to Instantly`
    })
}

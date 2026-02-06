import { createClient } from '@supabase/supabase-js'

// Use Service Role to fetch lead data for public audit page
// Be careful to only return safe data
export async function getPublicLead(id: string) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single()

    if (!lead) return null

    // Whitelist return fields to avoid leaking sensitive info if we ever add it
    return {
        id: lead.id,
        business_name: lead.business_name,
        city: lead.city,
        website: lead.website_url || lead.website,
        rating: lead.rating,
        review_count: lead.review_count,
        scan_score: lead.scan_score,
        scan_summary: lead.scan_summary,
        scan_reasons: lead.scan_reasons,
        google_full_address: lead.google_full_address,
        enrichment_data: lead.enrichment_data,
        category: lead.category
    }
}

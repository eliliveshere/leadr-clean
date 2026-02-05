import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

// Reuse schema from generate-outreach
const GeneratedContentSchema = z.object({
    sms: z.array(z.object({
        variant: z.enum(['ultra_short', 'short', 'follow_up']),
        text: z.string()
    })),
    email: z.array(z.object({
        variant: z.enum(['short', 'follow_up']),
        subject: z.string(),
        text: z.string()
    })),
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'placeholder' })

export async function POST(request: Request) {
    // This endpoint processes ONE lead from the queue to avoid timeouts
    // We can call it in a loop from the client or a cron job
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    // 1. Lock next queued item
    // Postgres doesn't have easy atomic pop without functions, so we check status
    const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('outreach_status', 'queued')
        .order('outreach_scheduled_at', { ascending: true }) // FIFO
        .limit(1)
        .single()

    if (!lead) {
        return NextResponse.json({ status: 'empty', message: 'No leads in queue' })
    }

    // 2. Mark as processing
    await supabase.from('leads').update({ outreach_status: 'processing' }).eq('id', lead.id)

    try {
        // 3. Generate Message content (Auto-Generate "Standard" or "Friendly" style)
        // We replicate the logic from generate-outreach/route.ts here for automation
        const prompt = `
            Generate concise "Friendly" outreach messages for this lead.
            Business: ${lead.business_name}
            Issues: ${lead.scan_reasons?.join(', ')}
            Score: ${lead.scan_score}
            
            Rules:
            - SMS: Keep it conversational. "Hey [Name], quick question..."
            - Email: Value-first, mentioning their score/audit.
        `

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: zodResponseFormat(GeneratedContentSchema, "outreach"),
        })

        const content = completion.choices[0].message.content
        const generated = content ? JSON.parse(content) : null

        if (!generated) throw new Error("AI Generation failed")

        const smsBody = generated.sms[0]?.text
        const emailSubject = generated.email[0]?.subject
        const emailBody = generated.email[0]?.text

        // 4. Send (Mocking send execution if keys missing, or real send)
        const results: any = { generated }

        // Send SMS if phone exists
        if (lead.phone && smsBody && process.env.TWILIO_ACCOUNT_SID) {
            // Actual send call would go here (or call our own internal API)
            // For now we simulate success or use the fetch to our own route if we want separation
            // Let's just assume we log it to `outreach_sends`
            await supabase.from('outreach_sends').insert({
                user_id: user.id,
                lead_id: lead.id,
                channel: 'sms',
                provider: 'twilio',
                to_value: lead.phone,
                body: smsBody,
                status: 'sent'
            })
            results.sms_sent = true
        }

        // Send Email if email exists
        if (lead.email && emailBody && process.env.RESEND_API_KEY) {
            await supabase.from('outreach_sends').insert({
                user_id: user.id,
                lead_id: lead.id,
                channel: 'email',
                provider: 'resend',
                to_value: lead.email,
                subject: emailSubject,
                body: emailBody,
                status: 'sent'
            })
            results.email_sent = true
        }

        // 5. Mark Done
        await supabase.from('leads').update({
            outreach_status: 'sent',
            outreach_results: results,
            last_contacted_at: new Date().toISOString(),
            status: 'contacted'
        }).eq('id', lead.id)

        return NextResponse.json({ status: 'success', lead_id: lead.id, results })

    } catch (e: any) {
        console.error("Queue Error", e)
        await supabase.from('leads').update({
            outreach_status: 'failed',
            outreach_results: { error: e.message }
        }).eq('id', lead.id)
        return NextResponse.json({ status: 'failed', lead_id: lead.id, error: e.message })
    }
}

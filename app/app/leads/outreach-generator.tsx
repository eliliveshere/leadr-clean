'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface OutreachGeneratorProps {
    lead: any
}

export default function OutreachGenerator({ lead }: OutreachGeneratorProps) {
    const [generating, setGenerating] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [selectedStyle, setSelectedStyle] = useState<'direct' | 'friendly' | 'professional'>('friendly')

    async function handleGenerate() {
        setGenerating(true)
        try {
            const res = await fetch('/api/generate-outreach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead: lead,
                    style: selectedStyle,
                    sequence: 'first_touch'
                })
            })

            if (!res.ok) {
                const err = await res.text()
                console.error("Generator Fetch Error:", err)
                throw new Error('Generation failed: ' + err)
            }
            const data = await res.json()
            console.log("Generator Output:", data) // Debug log

            if (!data || (!data.sms?.length && !data.email?.length)) {
                toast.error('AI returned no messages. Check console.')
            }

            setResult(data)
        } catch (e: any) {
            console.error(e)
            toast.error(e.message || 'Failed to generate messages')
        } finally {
            setGenerating(false)
        }
    }

    async function sendSMS(body: string) {
        if (!confirm('Send SMS to ' + lead.phone + '?')) return
        try {
            const res = await fetch('/api/send-sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead_id: lead.id, body })
            })
            if (!res.ok) throw new Error('Send failed')
            toast.success('SMS Sent!')
        } catch (e) {
            toast.error('Failed to send SMS')
        }
    }

    async function sendEmail(subject: string, body: string) {
        if (!confirm('Send Email to ' + lead.email + '?')) return
        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead_id: lead.id, subject, body })
            })
            if (!res.ok) throw new Error('Send failed')
            toast.success('Email Sent!')
        } catch (e) {
            toast.error('Failed to send Email')
        }
    }

    return (
        <div className="border p-4 rounded bg-white shadow-sm flex flex-col space-y-4">
            <h2 className="font-semibold text-lg">AI Outreach Generator</h2>
            <p className="text-sm text-gray-500">Create personalized messages based on enrichment data.</p>

            <div className="flex gap-2 text-xs">
                {(['direct', 'friendly', 'professional'] as const).map(style => (
                    <button
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        className={`px-3 py-1 rounded border capitalize ${selectedStyle === style ? 'bg-black text-white border-black' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                        {style}
                    </button>
                ))}
            </div>

            <button
                onClick={handleGenerate}
                disabled={generating}
                className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
            >
                {generating ? 'Generating...' : 'Generate Options'}
            </button>

            {result && (
                <div className="space-y-6 mt-4 pt-4 border-t">
                    <div>
                        <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                            💬 SMS Options
                            <span className="text-[10px] bg-gray-100 px-1 rounded text-gray-500">Target: {lead.phone || 'No Phone'}</span>
                        </h3>
                        {lead.phone ? (
                            <div className="space-y-3">
                                {result.sms.map((msg: any, i: number) => (
                                    <div key={i} className="bg-gray-50 p-3 rounded text-sm group relative">
                                        <div className="mb-2 text-gray-700">{msg.text}</div>
                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                            <span className="capitalize">{msg.variant}</span>
                                            <button
                                                onClick={() => sendSMS(msg.text)}
                                                className="bg-white border text-black px-2 py-0.5 rounded shadow-sm hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                                            >
                                                Send SMS
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-xs text-red-400 italic">Add phone number to send SMS.</p>}
                    </div>

                    <div>
                        <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                            📧 Email Options
                            <span className="text-[10px] bg-gray-100 px-1 rounded text-gray-500">Target: {lead.email || 'No Email'}</span>
                        </h3>
                        {lead.email ? (
                            <div className="space-y-3">
                                {result.email.map((msg: any, i: number) => (
                                    <div key={i} className="bg-gray-50 p-3 rounded text-sm group relative">
                                        <div className="font-medium mb-1 border-b pb-1">{msg.subject}</div>
                                        <div className="mb-2 text-gray-700 whitespace-pre-wrap">{msg.text}</div>
                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                            <span className="capitalize">{msg.variant}</span>
                                            <button
                                                onClick={() => sendEmail(msg.subject, msg.text)}
                                                className="bg-white border text-black px-2 py-0.5 rounded shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                            >
                                                Send Email
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-xs text-red-400 italic">Add email to send.</p>}
                    </div>
                </div>
            )}
        </div>
    )
}

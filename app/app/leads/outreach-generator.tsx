'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Mail, MessageSquare, Linkedin, Copy, RefreshCw, Send, Check } from 'lucide-react'

interface OutreachGeneratorProps {
    lead: any
}

type TabType = 'email' | 'linkedin' | 'sms'
type ToneType = 'direct' | 'friendly' | 'professional'

export default function OutreachGenerator({ lead }: OutreachGeneratorProps) {
    const [activeTab, setActiveTab] = useState<TabType>('email')
    const [tone, setTone] = useState<ToneType>('friendly')
    const [generating, setGenerating] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [copied, setCopied] = useState(false)

    async function handleGenerate(styleOverride?: ToneType) {
        const styleToUse = styleOverride || tone
        if (styleOverride) setTone(styleOverride)

        setGenerating(true)
        setResult(null) // Clear previous results to show loading state cleanly

        try {
            // We request multiple formats at once
            const res = await fetch('/api/generate-outreach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead: lead,
                    style: styleToUse,
                    sequence: 'first_touch'
                })
            })

            if (!res.ok) throw new Error('Generation failed')

            const data = await res.json()
            setResult(data)

            if (!data.email?.length && !data.sms?.length) {
                toast.error('AI returned empty results.')
            }

        } catch (e) {
            console.error(e)
            toast.error('Failed to generate messages')
        } finally {
            setGenerating(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success("Copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    // content display helper
    const renderContent = () => {
        if (!result && !generating) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                    <MessageSquare className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm">Select tone and click generate.</p>
                </div>
            )
        }

        if (generating) {
            return (
                <div className="p-6 space-y-4">
                    <div className="h-8 bg-zinc-200 rounded w-1/3 animate-pulse mb-6"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-zinc-100 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-zinc-100 rounded w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-zinc-100 rounded w-4/6 animate-pulse"></div>
                    </div>
                </div>
            )
        }

        // Display Result based on Tab
        let content = ""
        let subject = ""

        if (activeTab === 'email') {
            const emailData = result.email?.[0] // Take first option
            if (emailData) {
                subject = emailData.subject
                content = emailData.text
            } else {
                return <div className="p-4 text-center text-zinc-400 text-sm">No email generated.</div>
            }
        } else if (activeTab === 'linkedin') {
            // Use SMS/Short message logic for LinkedIn for now if specific LinkedIn field missing
            const liData = result.linkedin?.[0] || result.sms?.[0]
            if (liData) {
                content = liData.text
            } else {
                return <div className="p-4 text-center text-zinc-400 text-sm">No LinkedIn message generated.</div>
            }
        } else {
            // SMS
            const smsData = result.sms?.[0]
            if (smsData) {
                content = smsData.text
            } else {
                return <div className="p-4 text-center text-zinc-400 text-sm">No SMS generated.</div>
            }
        }

        // Render the Editor-like View
        return (
            <div className="space-y-3 animate-in fade-in duration-300">
                {subject && (
                    <div className="border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50/50">
                        <span className="text-xs font-bold text-zinc-400 uppercase mr-2">Subject:</span>
                        <span className="text-sm font-medium text-zinc-900">{subject}</span>
                    </div>
                )}

                <div className="relative">
                    <textarea
                        className="w-full h-48 p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                        value={content}
                        readOnly // For now read-only to keep simple
                    />

                    <button
                        onClick={() => copyToClipboard(content)}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur border border-zinc-200 rounded-md hover:bg-white text-zinc-500 hover:text-indigo-600 transition-colors shadow-sm"
                        title="Copy Text"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <div className="absolute bottom-3 right-3 text-[10px] text-zinc-400 bg-zinc-100/50 px-2 py-1 rounded">
                        {content.length} chars
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => handleGenerate('direct')}
                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-[10px] font-medium text-zinc-600 rounded-lg transition-colors border border-zinc-200"
                    >
                        Make Direct
                    </button>
                    <button
                        onClick={() => handleGenerate('friendly')}
                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-[10px] font-medium text-zinc-600 rounded-lg transition-colors border border-zinc-200"
                    >
                        Rewrite Friendly
                    </button>
                </div>

                {activeTab === 'email' && (
                    <button
                        onClick={() => {
                            if (confirm(`Open mail client for ${lead.email}?`)) {
                                window.location.href = `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium"
                    >
                        <Send className="w-3 h-3" /> Open in Mail App
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header / Controls */}
            <div className="flex flex-col gap-4 mb-4">

                {/* Tabs */}
                <div className="flex p-1 bg-zinc-100/80 rounded-lg">
                    <button
                        onClick={() => setActiveTab('email')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'email' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <Mail className="w-3.5 h-3.5" /> Email
                    </button>
                    <button
                        onClick={() => setActiveTab('linkedin')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'linkedin' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </button>
                    <button
                        onClick={() => setActiveTab('sms')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'sms' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" /> SMS
                    </button>
                </div>

                {/* Tone & Generate */}
                <div className="flex gap-2">
                    <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value as ToneType)}
                        className="bg-white border border-zinc-200 text-zinc-700 text-xs font-medium rounded-lg px-3 py-2 outline-none focus:border-zinc-300 w-1/3"
                    >
                        <option value="friendly">Friendly</option>
                        <option value="professional">Professional</option>
                        <option value="direct">Direct</option>
                    </select>

                    <button
                        onClick={() => handleGenerate()}
                        disabled={generating}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                        {result ? 'Regenerate' : 'Generate Messages'}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-zinc-50/30 rounded-xl border border-dashed border-zinc-200 p-1 min-h-[300px]">
                {renderContent()}
            </div>
        </div>
    )
}

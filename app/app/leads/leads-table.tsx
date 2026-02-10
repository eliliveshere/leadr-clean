'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Link2, Sparkles, Zap, Loader2, CheckCircle2, AlertCircle, Download } from 'lucide-react'
import { toast } from 'sonner'

export default function LeadsTable({ leads: initialLeads }: { leads: any[] }) {
    const [leads, setLeads] = useState(initialLeads)
    const [selected, setSelected] = useState<string[]>([])
    const [scanning, setScanning] = useState(false)
    const [enriching, setEnriching] = useState(false)
    const [progress, setProgress] = useState<{ completed: number, total: number } | null>(null)

    useEffect(() => {
        setLeads(initialLeads)
    }, [initialLeads])

    const router = useRouter()

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelected(leads.map((l: any) => l.id))
        } else {
            setSelected([])
        }
    }

    const handleSelect = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const copyAuditLink = (id: string) => {
        const url = `${window.location.origin}/audit/${id}`
        navigator.clipboard.writeText(url)
        toast.success("Audit link copied!")
    }

    const downloadCSV = () => {
        if (selected.length === 0) return

        const selectedLeads = leads.filter((l: any) => selected.includes(l.id))

        // Define headers
        const headers = ['company_name', 'website', 'first_name', 'quick_win_1', 'quick_win_2', 'quick_win_3', 'estimated_lift']

        const rows = selectedLeads.map((l: any) => {
            const data = l.enrichment_data?.email_data || {}
            const wins = data.quick_wins || []

            // Helper to escape CSV fields
            const clean = (text: string) => {
                const safe = (text || '').replace(/"/g, '""'); // Escape double quotes
                return `"${safe}"`
            }

            return [
                clean(l.business_name),
                clean(l.website_url || l.website),
                clean(data.found_first_name || ''),
                clean(wins[0] || ''),
                clean(wins[1] || ''),
                clean(wins[2] || ''),
                clean(data.estimated_lift || '')
            ].join(',')
        })

        const csvContent = [headers.join(','), ...rows].join('\n')

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Reuse existing scan logic
    const runScan = async () => {
        if (selected.length === 0) return
        setScanning(true)
        setProgress({ completed: 0, total: selected.length })

        try {
            const res = await fetch('/api/qualification/start', {
                method: 'POST',
                body: JSON.stringify({ lead_ids: selected })
            })
            if (!res.ok) throw new Error('Start failed')

            const { job_id } = await res.json()

            const processBatch = async () => {
                const runRes = await fetch('/api/qualification/run', {
                    method: 'POST',
                    body: JSON.stringify({ job_id })
                })
                const runData = await runRes.json()
                const statusRes = await fetch(`/api/qualification/status?job_id=${job_id}`)
                const statusData = await statusRes.json()

                setProgress({ completed: statusData.completed, total: statusData.total })

                if (statusData.status === 'running' || statusData.status === 'queued') {
                    if (runData.processed === 0 && runData.status !== 'done') {
                        setTimeout(processBatch, 2000)
                    } else {
                        setTimeout(processBatch, 500)
                    }
                } else {
                    setScanning(false)
                    setProgress(null)
                    router.refresh()
                }
            }
            processBatch()

        } catch (e) {
            console.error(e)
            setScanning(false)
        }
    }

    // New Bulk Enrichment Logic (Client-side Loop mostly)
    const runEnrich = async () => {
        if (selected.length === 0) return
        setEnriching(true)
        setProgress({ completed: 0, total: selected.length })

        // We'll process them 1 by 1 to not timeout Vercel limit on a single bulk request if we made one.
        // Actually, individual POSTs is the safest "poor man's queue".
        let completed = 0;

        // Helper to enrich one
        const enrichOne = async (id: string) => {
            const formData = new FormData()
            formData.append('lead_id', id)
            await fetch('/api/enrich', { method: 'POST', body: formData })
            completed++
            setProgress({ completed, total: selected.length })
        }

        // Run with concurrency of 3
        const batchSize = 3;
        for (let i = 0; i < selected.length; i += batchSize) {
            const batch = selected.slice(i, i + batchSize);
            await Promise.all(batch.map(id => enrichOne(id)));
        }

        setEnriching(false)
        setProgress(null)
        router.refresh()
        toast.success(`Enriched ${selected.length} leads`)
    }

    // Add to Queue Logic
    const addToQueue = async () => {
        if (selected.length === 0) return

        // 1. Mark as queued
        const { error } = await createClient()
            .from('leads')
            .update({ outreach_status: 'queued', outreach_scheduled_at: new Date().toISOString() })
            .in('id', selected)

        if (error) {
            toast.error("Failed to queue")
            return
        }

        toast.success(`Queued ${selected.length} leads`)
        setEnriching(true) // Reuse loader state for visual feedback

        // 2. Trigger processor loop
        let completed = 0
        const processOne = async () => {
            await fetch('/api/outreach/process-queue', { method: 'POST' })
            completed++
            setProgress({ completed, total: selected.length })
        }

        // Run sequentially to be safe with rate limits
        for (let i = 0; i < selected.length; i++) {
            await processOne() // Intentionally serial to avoid rate limits
        }

        setEnriching(false)
        setProgress(null)
        router.refresh()
        toast.success("Outreach batch complete")
    }

    return (
        <div className="space-y-4 font-sans">
            <div className="flex gap-2 mb-4 items-center bg-gray-50 p-3 rounded-lg border">
                <span className="text-sm font-medium text-gray-500 mr-2">Bulk Actions ({selected.length}):</span>

                {scanning || enriching ? (
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded text-sm flex items-center gap-2 animate-pulse">
                        <Loader2 className="animate-spin h-4 w-4" />
                        {scanning ? 'Scanning...' : 'Processing...'}
                        {progress ? `${progress.completed}/${progress.total}` : ''}
                    </div>
                ) : (
                    <>
                        <button
                            onClick={runScan}
                            disabled={selected.length === 0}
                            className="bg-white border text-black hover:bg-gray-100 px-3 py-1.5 rounded text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            <Zap className="w-3 h-3" />
                            Qualify
                        </button>
                        <button
                            onClick={runEnrich}
                            disabled={selected.length === 0}
                            className="bg-white border text-black hover:bg-gray-100 px-3 py-1.5 rounded text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            Enrich
                        </button>
                        <button
                            onClick={async () => {
                                const campaignId = window.prompt("Enter Instantly Campaign ID (Optional):", "")
                                if (campaignId === null) return // Cancelled

                                setEnriching(true)
                                try {
                                    const res = await fetch('/api/outreach/sync-instantly', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            lead_ids: selected,
                                            campaign_id: campaignId
                                        })
                                    })
                                    const data = await res.json()
                                    if (data.success) {
                                        toast.success(`Pushed ${data.pushed} leads to Instantly!`)
                                    } else {
                                        toast.error("Failed to push to Instantly")
                                    }
                                } catch (e) {
                                    console.error(e)
                                    toast.error("Error connecting to Instantly")
                                } finally {
                                    setEnriching(false)
                                    setSelected([])
                                }
                            }}
                            disabled={selected.length === 0}
                            className="bg-white border text-black hover:bg-gray-100 px-3 py-1.5 rounded text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Push to Instantly
                        </button>
                        <button
                            onClick={addToQueue}
                            disabled={selected.length === 0}
                            className="bg-black text-white hover:bg-gray-800 px-3 py-1.5 rounded text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Start Outreach Queue
                        </button>
                    </>
                )}
            </div>

            <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr className="border-b">
                            <th className="p-3 w-[40px]">
                                <input type="checkbox" onChange={handleSelectAll} checked={selected.length === leads.length && leads.length > 0} className="rounded border-gray-300" />
                            </th>
                            <th className="p-3">Business</th>
                            <th className="p-3">Enrichment</th>
                            <th className="p-3">Audit</th>
                            <th className="p-3">Score</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {leads.map((lead: any) => (
                            <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-3 align-top pt-4">
                                    <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => handleSelect(lead.id)} className="rounded border-gray-300" />
                                </td>
                                <td className="p-3">
                                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Link href={`/app/leads/${lead.id}`} className="hover:text-blue-600">
                                            {lead.business_name}
                                        </Link>
                                        {lead.google_verified && (
                                            <span title="Google Verified" className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-100">Verified</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                                        <span>{lead.city}</span>
                                        {lead.category && <span className="bg-gray-100 px-1 rounded">{lead.category}</span>}
                                        <span className={`px-1.5 rounded-full text-[10px] border capitalize ${lead.status === 'new' ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {lead.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-3 align-middle">
                                    {lead.enrichment_status === 'enriched' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                            <Sparkles className="w-3 h-3" /> Enriched
                                        </span>
                                    ) : lead.enrichment_status === 'enriching' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Working
                                        </span>
                                    ) : lead.enrichment_status === 'failed' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                            <AlertCircle className="w-3 h-3" /> Failed
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">Pending</span>
                                    )}
                                </td>
                                <td className="p-3 align-middle">
                                    {/* Show audit link only if we have a score or enrichment data */}
                                    {(lead.scan_score || lead.enrichment_status === 'enriched') ? (
                                        <button
                                            onClick={() => copyAuditLink(lead.id)}
                                            className="inline-flex items-center gap-1 text-xs bg-white hover:bg-gray-100 border px-2 py-1 rounded text-gray-600 transition-colors shadow-sm"
                                        >
                                            <Link2 className="w-3 h-3" /> Audit Link
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-300 italic">No data</span>
                                    )}
                                </td>
                                <td className="p-3 align-middle">
                                    {lead.scan_score !== null ? (
                                        <div className={`font-bold text-base ${lead.scan_score > 7 ? 'text-green-600' : lead.scan_score < 4 ? 'text-red-500' : 'text-yellow-600'}`}>
                                            {lead.scan_score}
                                        </div>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                                <td className="p-3 text-right align-middle">
                                    <Link
                                        href={`/app/leads/${lead.id}`}
                                        className="inline-block text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded transition-colors"
                                    >
                                        Open
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No leads found. Import some to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


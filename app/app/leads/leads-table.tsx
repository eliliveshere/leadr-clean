'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Link2, Sparkles, Zap, Loader2, Search, Filter, ArrowUpDown, MoreHorizontal, Copy, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { toast } from 'sonner'
import RowActionMenu from './row-action-menu'

type SortField = 'created_at' | 'business_name' | 'status' | 'scan_score'
type SortOrder = 'asc' | 'desc'

export default function LeadsTable({ leads: initialLeads }: { leads: any[] }) {
    const router = useRouter()

    // Core Data State
    const [leads, setLeads] = useState(initialLeads)
    const [selected, setSelected] = useState<string[]>([])

    // Processing States
    const [scanning, setScanning] = useState(false)
    const [enriching, setEnriching] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [progress, setProgress] = useState<{ completed: number, total: number } | null>(null)

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [sortField, setSortField] = useState<SortField>('created_at')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    useEffect(() => {
        setLeads(initialLeads)
    }, [initialLeads])

    // --- Processing Logic (Enrich/Scan/Delete) ---

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${selected.length} leads? This cannot be undone.`)) return
        setDeleting(true)
        const supabase = createClient()
        const { error } = await supabase.from('leads').delete().in('id', selected)
        if (error) {
            toast.error("Failed to delete")
        } else {
            toast.success("Leads deleted")
            setSelected([])
            router.refresh()
        }
        setDeleting(false)
    }

    const runEnrich = async () => {
        if (selected.length === 0) return
        setEnriching(true)
        setProgress({ completed: 0, total: selected.length })
        let completed = 0;

        // Batch process
        const batchSize = 3;
        for (let i = 0; i < selected.length; i += batchSize) {
            const batch = selected.slice(i, i + batchSize);
            await Promise.all(batch.map(async (id) => {
                const formData = new FormData()
                formData.append('lead_id', id)
                await fetch('/api/enrich', { method: 'POST', body: formData })
                completed++
                setProgress({ completed, total: selected.length })
            }));
        }
        setEnriching(false)
        setProgress(null)
        router.refresh()
        toast.success(`Enriched ${selected.length} leads`)
    }

    const pushToInstantly = async () => {
        const campaignId = window.prompt("Enter Instantly Campaign ID:", "2693b890-5098-46f0-95e5-9bb41da97f10")
        if (!campaignId) return

        setEnriching(true)
        try {
            const res = await fetch('/api/outreach/sync-instantly', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead_ids: selected, campaign_id: campaignId })
            })
            const data = await res.json()
            if (data.success) toast.success(`Pushed ${data.pushed} leads!`)
            else toast.error(data.message || "Failed")
        } catch (e) {
            toast.error("Connection failed")
        }
        setEnriching(false)
        setSelected([])
    }

    // --- Filtering & Sorting Logic ---

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch =
                lead.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.category?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusFilter === 'all' || lead.enrichment_status === statusFilter

            return matchesSearch && matchesStatus
        }).sort((a, b) => {
            const aVal = a[sortField]
            const bVal = b[sortField]

            if (aVal === bVal) return 0

            const compare = (aVal > bVal ? 1 : -1)
            return sortOrder === 'asc' ? compare : -compare
        })
    }, [leads, searchQuery, statusFilter, sortField, sortOrder])

    // Pagination Logic
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
    const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelected(paginatedLeads.map(l => l.id))
        else setSelected([])
    }

    const handleSelect = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    // --- UI Components ---

    return (
        <div className="space-y-4 font-sans relative pb-20">

            {/* Top Utility Bar */}
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-10">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search business, city, category..."
                        className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters & Sort */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none cursor-pointer hover:bg-zinc-100 transition-colors"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="enriched">Enriched</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    <div className="h-6 w-px bg-zinc-200 mx-1" />

                    <select
                        className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none cursor-pointer hover:bg-zinc-100 transition-colors"
                        value={`${sortField}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('-') as [SortField, SortOrder]
                            setSortField(field)
                            setSortOrder(order)
                        }}
                    >
                        <option value="created_at-desc">Newest First</option>
                        <option value="created_at-asc">Oldest First</option>
                        <option value="scan_score-desc">Highest Score</option>
                        <option value="scan_score-asc">Lowest Score</option>
                    </select>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-100/80 text-zinc-600 font-medium border-b border-zinc-200">
                        <tr>
                            <th className="p-4 w-[32px]">
                                <input type="checkbox" onChange={handleSelectAll} checked={selected.length > 0 && selected.length === paginatedLeads.length} className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                            </th>
                            <th className="p-4 font-medium">Business</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Fit</th>
                            <th className="p-4 font-medium">Quick Actions</th>
                            <th className="p-4 w-[60px]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {paginatedLeads.map((lead: any) => (
                            <tr key={lead.id} className="group hover:bg-zinc-50/50 transition-colors">
                                <td className="p-4 align-top pt-5">
                                    <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => handleSelect(lead.id)} className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                                </td>

                                <td className="p-4">
                                    <div className="font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                                        <Link href={`/app/leads/${lead.id}`}>
                                            {lead.business_name}
                                        </Link>
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1 flex flex-wrap gap-2 items-center">
                                        {lead.website_url && (
                                            <a href={lead.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-indigo-500 truncate max-w-[150px]">
                                                {lead.website_url.replace(/^https?:\/\//, '')}
                                            </a>
                                        )}
                                        {lead.city && (
                                            <>
                                                <span className="text-zinc-300">•</span>
                                                <span>{lead.city}</span>
                                            </>
                                        )}
                                    </div>
                                </td>

                                <td className="p-4 align-middle">
                                    {lead.enrichment_data ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Enriched
                                        </span>
                                    ) : lead.enrichment_status === 'enriching' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Processing
                                        </span>
                                    ) : lead.enrichment_status === 'failed' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                            Failed
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
                                            Not Enriched
                                        </span>
                                    )}
                                </td>

                                <td className="p-4 align-middle">
                                    {lead.scan_score ? (
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg font-bold ${lead.scan_score >= 7 ? 'text-emerald-600' : lead.scan_score <= 4 ? 'text-red-500' : 'text-amber-500'}`}>
                                                {lead.scan_score}
                                            </span>
                                            <span className="text-xs text-zinc-400">/ 10</span>
                                        </div>
                                    ) : (
                                        <span className="text-zinc-300 text-[10px] uppercase font-bold tracking-wider opacity-50">Unscored</span>
                                    )}
                                </td>

                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/app/leads/${lead.id}`}
                                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-indigo-600 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => {
                                                const formData = new FormData()
                                                formData.append('lead_id', lead.id)
                                                fetch('/api/enrich', { method: 'POST', body: formData })
                                                toast.success("Enrichment queued")
                                            }}
                                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-purple-600 transition-colors"
                                            title="Quick Enrich"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (lead.enrichment_data) {
                                                    navigator.clipboard.writeText(`${window.location.origin}/audit/${lead.id}`)
                                                    toast.success("Audit link copied")
                                                } else {
                                                    toast.error("Enrich lead first")
                                                }
                                            }}
                                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition-colors"
                                            title="Copy Audit Link"
                                        >
                                            <Link2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>

                                <td className="p-4 align-middle text-right">
                                    <RowActionMenu lead={lead} />
                                </td>
                            </tr>
                        ))}

                        {paginatedLeads.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-zinc-500">
                                        <Search className="w-8 h-8 mb-3 text-zinc-300" />
                                        <p className="font-medium">No leads found</p>
                                        <p className="text-xs text-zinc-400 mt-1">Try adjusting your filters or import new leads.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Footer */}
                <div className="px-4 py-3 border-t border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-medium">
                        Showing <span className="text-zinc-900">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredLeads.length)}</span> to <span className="text-zinc-900">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="text-zinc-900">{filteredLeads.length}</span>
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1 rounded hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-transparent text-zinc-500 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-transparent text-zinc-500 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sticky Selection Bar */}
            {selected.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-4">
                    <span className="text-sm font-medium border-r border-zinc-700 pr-6">
                        {selected.length} Selected
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={runEnrich}
                            disabled={enriching}
                            className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            {enriching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
                            Enrich
                        </button>

                        <button
                            onClick={pushToInstantly}
                            disabled={enriching}
                            className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            <Zap className="w-4 h-4 text-yellow-400" />
                            Push to Instantly
                        </button>

                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg text-sm transition-colors ml-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}

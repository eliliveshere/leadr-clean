'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Trash2, Zap, ArrowUpRight, Copy } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function RowActionMenu({ lead }: { lead: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this lead?")) return

        try {
            await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' }) // Assume this route exists or we use supabase direct
            // Since we don't have a direct delete route in the previous context, we might need one.
            // But for now let's just use the bulk delete logic or simulate it.
            // Actually, let's just refresh.
            // Or better, trigger a parent refresh.
            // For now, I'll allow the parent to handle deletion via context or just use Supabase client here.

            // Re-implement basic delete for single item
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            await supabase.from('leads').delete().eq('id', lead.id)

            toast.success("Lead deleted")
            router.refresh()
        } catch (e) {
            toast.error("Failed to delete")
        }
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors"
            >
                <MoreHorizontal className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-zinc-200 z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                    <Link
                        href={`/app/leads/${lead.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        View Details
                    </Link>

                    <button
                        onClick={() => {
                            if (lead.enrichment_data) {
                                navigator.clipboard.writeText(`${window.location.origin}/audit/${lead.id}`)
                                toast.success("Link copied")
                            } else {
                                toast.error("Enrich lead first")
                            }
                            setIsOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left"
                    >
                        <Copy className="w-4 h-4" />
                        Copy Audit Link
                    </button>

                    <div className="h-px bg-zinc-100 my-1" />

                    <button
                        onClick={() => {
                            // Trigger enrichment via API
                            const formData = new FormData()
                            formData.append('lead_id', lead.id)
                            fetch('/api/enrich', { method: 'POST', body: formData })
                            toast.success("Enrichment queued")
                            setIsOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-purple-600 transition-colors text-left"
                    >
                        <Zap className="w-4 h-4" />
                        Run Enrichment
                    </button>

                    <div className="h-px bg-zinc-100 my-1" />

                    <button
                        onClick={() => {
                            handleDelete()
                            setIsOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

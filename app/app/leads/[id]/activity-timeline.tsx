import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, FilePlus2, Sparkles, AlertCircle, Clock } from 'lucide-react'

export default function ActivityTimeline({ lead }: { lead: any }) {
    // Construct virtual events from lead state
    const events = [
        {
            type: 'created',
            title: 'Lead Imported',
            desc: `Added via ${lead.source || 'manual entry'}`,
            date: new Date(lead.created_at),
            icon: FilePlus2,
            color: 'text-zinc-400 bg-zinc-100'
        }
    ]

    if (lead.enrichment_status === 'enriched') {
        // We don't have the exact enrichment time, so we'll use updated_at or a slightly later time from created
        // Ideally we'd have a specific timestamp, but we'll use updated_at for now as a proxy or just "Recently"
        events.unshift({
            type: 'enriched',
            title: 'Enrichment Completed',
            desc: 'Digital footprint analysis finished successfully.',
            date: new Date(lead.updated_at), // Approximation
            icon: Sparkles,
            color: 'text-purple-600 bg-purple-100'
        })
    } else if (lead.enrichment_status === 'failed') {
        events.unshift({
            type: 'failed',
            title: 'Enrichment Failed',
            desc: 'System could not verify digital footprint.',
            date: new Date(lead.updated_at),
            icon: AlertCircle,
            color: 'text-red-600 bg-red-100'
        })
    }

    if (lead.scan_status === 'done') {
        events.unshift({
            type: 'scanned',
            title: 'Qualification Scan',
            desc: `Scored ${lead.scan_score}/10 with confidence level: ${lead.scan_confidence}`,
            date: new Date(lead.updated_at), // Approximation
            icon: CheckCircle2,
            color: 'text-emerald-600 bg-emerald-100'
        })
    }

    // Sort by date desc
    events.sort((a, b) => b.date.getTime() - a.date.getTime())

    return (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
            <h2 className="font-semibold text-zinc-900 mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                Activity History
            </h2>

            <div className="relative border-l border-zinc-200 ml-3 space-y-8">
                {events.map((event, i) => {
                    const Icon = event.icon
                    return (
                        <div key={i} className="relative pl-8">
                            {/* Icon Node */}
                            <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${event.color}`}>
                                <Icon className="w-3 h-3" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-semibold text-zinc-900">{event.title}</span>
                                    <span className="text-xs text-zinc-400 tabular-nums">
                                        {formatDistanceToNow(event.date, { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    {event.desc}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 text-center">
                <button className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
                    View full audit logs
                </button>
            </div>
        </div>
    )
}

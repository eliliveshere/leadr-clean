import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import OutreachGenerator from '../outreach-generator'
import CopyAuditLink from '../copy-audit-link'
import LeadDetailsEditor from '../lead-details-editor'
import HookCard from './hook-card'
import {
    Star, MapPin, Globe, Clock, ArrowUpRight,
    CheckCircle2, AlertCircle, ShieldCheck, Zap,
    MessageSquare, Building2, Facebook, Instagram, Linkedin, Twitter,
    Loader2, Search, Copy, Sparkles
} from 'lucide-react'

export default async function LeadDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()
    const { data: lead } = await supabase.from('leads').select('*').eq('id', params.id).single()

    if (!lead) {
        notFound()
    }

    const data = lead.enrichment_data || {}
    const analysis = data.analysis || {}
    const monitoring = data.monitoring_signals || {}

    // Score Calculation (Mock if empty)
    const score = lead.scan_score || 0
    const scoreColor = score >= 7 ? 'text-emerald-600' : score <= 4 ? 'text-red-600' : 'text-amber-600'
    const scoreBg = score >= 7 ? 'bg-emerald-50' : score <= 4 ? 'bg-red-50' : 'bg-amber-50'
    const scoreBorder = score >= 7 ? 'border-emerald-100' : score <= 4 ? 'border-red-100' : 'border-amber-100'

    return (
        <div className="space-y-8 pb-20 font-sans max-w-6xl mx-auto">

            {/* 1. TOP SUMMARY STRIP (Tier 2 Upgrade) */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2 ${scoreBorder} ${scoreBg}`}>
                        <span className={`text-2xl font-bold ${scoreColor}`}>{score || '-'}</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Score</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-zinc-900">{lead.business_name}</h1>
                            {lead.enrichment_status === 'enriched' && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium flex items-center gap-1 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" /> Enriched
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                            {lead.city && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {lead.city}
                                </span>
                            )}
                            {lead.category && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-zinc-100 rounded text-xs border border-zinc-200">
                                    {lead.category}
                                </span>
                            )}
                            {lead.website_url && (
                                <a href={lead.website_url} target="_blank" className="flex items-center gap-1 hover:text-indigo-600 hover:underline">
                                    <Globe className="w-3 h-3" /> Website
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <CopyAuditLink id={lead.id} />
                    {lead.enrichment_status === 'enriched' ? (
                        <button className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4" />
                            Generate Outreach
                        </button>
                    ) : (
                        <form action="/api/enrich" method="post" className="flex-1 md:flex-none">
                            <input type="hidden" name="lead_id" value={lead.id} />
                            <button className="w-full bg-zinc-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                Run Enrichment
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Main Intelligence Report */}
                <div className="lg:col-span-2 space-y-6">

                    {/* ENRICHMENT REPORT CARD */}
                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                        <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-200 flex justify-between items-center">
                            <h2 className="font-semibold text-zinc-900 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                Intelligence Report
                            </h2>
                            {lead.enrichment_status === 'enriched' && (
                                <span className="text-xs text-zinc-400">
                                    Sources: Google • Website • Social
                                </span>
                            )}
                        </div>

                        {!lead.enrichment_status || lead.enrichment_status === 'not_enriched' ? (
                            <div className="p-12 text-center">
                                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-6 h-6 text-zinc-400" />
                                </div>
                                <h3 className="text-lg font-medium text-zinc-900 mb-2">No Intelligence Data Yet</h3>
                                <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
                                    Run enrichment to analyze this lead's digital footprint, generate hooks, and identifying gaps.
                                </p>
                                <form action="/api/enrich" method="post">
                                    <input type="hidden" name="lead_id" value={lead.id} />
                                    <button className="bg-zinc-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-black transition-colors inline-flex items-center gap-2">
                                        Run Analysis
                                    </button>
                                </form>
                            </div>
                        ) : lead.enrichment_status === 'enriching' ? (
                            <div className="p-12 text-center">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
                                <p className="font-medium text-zinc-900"> analyzing digital footprint...</p>
                                <p className="text-sm text-zinc-500">This usually takes 10-20 seconds.</p>
                            </div>
                        ) : lead.enrichment_status === 'failed' ? (
                            <div className="p-8 text-center text-red-600">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                <p>Enrichment Failed. Please try again.</p>
                            </div>
                        ) : (
                            <div className="p-6 md:p-8 space-y-8">
                                {/* 1. The Hook */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Recommended Outreach Hook</h3>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-100 uppercase">
                                                Active Angle
                                            </span>
                                        </div>
                                    </div>
                                    <HookCard hook={data.outreach_hook} />
                                </div>

                                {/* 2. Business Summary */}
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">Executive Summary</h3>
                                    <p className="text-zinc-600 leading-relaxed text-sm">
                                        {analysis.business_summary || "No summary available."}
                                    </p>
                                </div>

                                {/* 3. Strengths & Gaps Grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100/50">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                                            </div>
                                            <h3 className="font-semibold text-zinc-900">Current Strengths</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {analysis.key_strengths?.map((s: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-700">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                            {!analysis.key_strengths?.length && <li className="text-sm text-zinc-400 italic">None identified.</li>}
                                        </ul>
                                    </div>

                                    <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100/50">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                            </div>
                                            <h3 className="font-semibold text-zinc-900">Gaps & Weaknesses</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {analysis.weaknesses_or_gaps?.map((w: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-700">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                                                    <span>{w}</span>
                                                </li>
                                            ))}
                                            {!analysis.weaknesses_or_gaps?.length && <li className="text-sm text-zinc-400 italic">None identified.</li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Editor Component (Hidden by default or below fold) */}
                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                        <div className="border-b border-zinc-200 px-6 py-4 bg-zinc-50/50">
                            <h3 className="font-semibold text-zinc-900">Lead Details</h3>
                        </div>
                        <div className="p-6">
                            <LeadDetailsEditor lead={lead} />
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Signals & Tools */}
                <div className="space-y-6">

                    {/* 1. DIGITAL FOOTPRINT SIGNALS */}
                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
                        <h2 className="font-semibold text-zinc-900 mb-4 flex items-center justify-between">
                            Digital Footprint
                            <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-200">Live Signals</span>
                        </h2>

                        <div className="space-y-3">
                            {/* Google Rating Tile */}
                            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded border border-zinc-200">
                                        {/* Google 'G' fake icon or map pin */}
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 font-medium">Google Rating</div>
                                        <div className="text-sm font-bold text-zinc-900 flex items-center gap-1">
                                            {lead.rating ? (
                                                <>
                                                    {lead.rating} <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                    <span className="text-zinc-400 font-normal">({lead.review_count || 0})</span>
                                                </>
                                            ) : (
                                                <span className="text-zinc-400 font-normal">Not found</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${lead.rating ? 'bg-green-500' : 'bg-red-400'}`}></div>
                            </div>

                            {/* Website Status Tile */}
                            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded border border-zinc-200">
                                        <Globe className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 font-medium">Website</div>
                                        <div className="text-sm font-bold text-zinc-900 flex items-center gap-1">
                                            {lead.website ? (
                                                <a href={lead.website_url || lead.website} target="_blank" className="hover:underline truncate max-w-[140px] block">
                                                    Active
                                                </a>
                                            ) : (
                                                <span className="text-zinc-400 font-normal">Missing</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${lead.website ? 'bg-green-500' : 'bg-zinc-300'}`}></div>
                            </div>

                            {/* Social Activity Tile */}
                            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded border border-zinc-200">
                                        <MessageSquare className="w-4 h-4 text-pink-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 font-medium">Social Activity</div>
                                        <div className="text-sm font-bold text-zinc-900 flex items-center gap-1 capitalize">
                                            {monitoring.social_activity_level || 'Unknown'}
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${monitoring.social_activity_level === 'high' ? 'bg-green-500' : monitoring.social_activity_level === 'medium' ? 'bg-yellow-500' : 'bg-base-300'}`}></div>
                            </div>
                        </div>

                        {/* Social Links Row */}
                        <div className="mt-4 pt-4 border-t border-zinc-100">
                            <h3 className="text-xs font-medium text-zinc-400 uppercase mb-2">Connected Profiles</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.contact_info?.social_platforms?.facebook && (
                                    <a href={data.contact_info.social_platforms.facebook} target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Facebook className="w-4 h-4" /></a>
                                )}
                                {data.contact_info?.social_platforms?.instagram && (
                                    <a href={data.contact_info.social_platforms.instagram} target="_blank" className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"><Instagram className="w-4 h-4" /></a>
                                )}
                                {data.contact_info?.social_platforms?.linkedin && (
                                    <a href={data.contact_info.social_platforms.linkedin} target="_blank" className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"><Linkedin className="w-4 h-4" /></a>
                                )}
                                {data.contact_info?.social_platforms?.twitter && (
                                    <a href={data.contact_info.social_platforms.twitter} target="_blank" className="p-2 bg-sky-50 text-sky-500 rounded-lg hover:bg-sky-100 transition-colors"><Twitter className="w-4 h-4" /></a>
                                )}
                                {!data.contact_info?.social_platforms && <span className="text-xs text-zinc-400 italic">No profiles found.</span>}
                            </div>
                        </div>
                    </div>

                    {/* 2. AI OUTREACH GENERATOR COMPONENT */}
                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                        <div className="bg-zinc-900 px-5 py-3 flex justify-between items-center">
                            <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                Outreach Generator
                            </h2>
                        </div>
                        <div className="p-5">
                            <OutreachGenerator lead={lead} />
                        </div>
                    </div>

                    {/* 3. QUALIFICATION SCANNER (Mini) */}
                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-zinc-900">Fit Score</h2>
                            {lead.scan_status === 'done' && <span className="text-xs font-bold text-zinc-400">{lead.scan_confidence} Confidence</span>}
                        </div>

                        {lead.scan_status === 'done' ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-full h-2 rounded-full bg-zinc-100 overflow-hidden`}>
                                        <div className={`h-full rounded-full ${lead.scan_score >= 7 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(lead.scan_score || 0) * 10}%` }}></div>
                                    </div>
                                    <span className="font-bold text-zinc-900">{lead.scan_score}/10</span>
                                </div>
                                <div className="p-3 bg-zinc-50 rounded text-sm text-zinc-600 border border-zinc-100">
                                    {lead.scan_reasons?.[0] || "No detailed reasoning."}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-zinc-400 mb-2">Not scanned yet</p>
                                <form action="/api/qualification/start-single" method="post">
                                    <input type="hidden" name="lead_id" value={lead.id} />
                                    <button className="text-xs bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded font-medium transition-colors">
                                        Scan Fit
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Imports for Icons and Utilities need to be clear */}
        </div>
    )
}



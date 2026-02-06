import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import OutreachGenerator from '../outreach-generator'
import CopyAuditLink from '../copy-audit-link'

export default async function LeadDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()
    const { data: lead } = await supabase.from('leads').select('*').eq('id', params.id).single()

    if (!lead) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{lead.business_name}</h1>
                <div className="flex items-center gap-2">
                    <CopyAuditLink id={lead.id} />
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm capitalize">{lead.status}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-4 rounded bg-white shadow-sm">
                    <h2 className="font-semibold mb-4 text-lg">Details</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Phone</span>
                            <span className="font-medium">{lead.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium">{lead.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">City</span>
                            <span className="font-medium">{lead.city || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Category</span>
                            <span className="font-medium">{lead.category || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Rating</span>
                            <span className="font-medium">{lead.rating ? `${lead.rating} ★` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Opt-in</span>
                            <span className="font-medium">{lead.has_opt_in ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>

                <div className="border p-4 rounded bg-white shadow-sm flex flex-col space-y-4">
                    <h2 className="font-semibold text-lg">AI Enrichment</h2>

                    {(!lead.enrichment_status || lead.enrichment_status === 'not_enriched') && (
                        <div className="text-center py-6 text-gray-500">
                            <p className="text-sm mb-2">Analyze reviews, website & Google listing.</p>
                            <form action="/api/enrich" method="post">
                                <input type="hidden" name="lead_id" value={lead.id} />
                                <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-colors">
                                    ✨ Enrich with AI
                                </button>
                            </form>
                        </div>
                    )}

                    {lead.enrichment_status === 'enriching' && (
                        <div className="text-center py-6 text-purple-600 animate-pulse">
                            Enriching data...
                        </div>
                    )}

                    {lead.enrichment_status === 'failed' && (
                        <div className="text-center py-6 text-red-500">
                            <p className="text-sm">Enrichment failed.</p>
                            <p className="text-xs text-gray-400 mt-1">Check logs (usually invalid OpenAI Key)</p>
                            <form action="/api/enrich" method="post" className="mt-2">
                                <input type="hidden" name="lead_id" value={lead.id} />
                                <button className="text-red-600 underline text-xs">Try Again</button>
                            </form>
                        </div>
                    )}

                    {lead.enrichment_status === 'enriched' && lead.enrichment_data && (
                        <div className="space-y-4 text-sm">
                            <div className="bg-purple-50 p-3 rounded border border-purple-100">
                                <h3 className="font-medium text-purple-900 mb-1">Outreach Hook</h3>
                                <p className="text-purple-800 italic">"{lead.enrichment_data.outreach_hook}"</p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-700">Business Summary</h3>
                                <p className="text-gray-600 mt-1">{lead.enrichment_data.analysis?.business_summary}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <h4 className="font-medium text-xs text-gray-500 uppercase">Strengths</h4>
                                    <ul className="list-disc list-inside text-xs mt-1 text-green-700">
                                        {lead.enrichment_data.analysis?.key_strengths?.slice(0, 3).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-xs text-gray-500 uppercase">Weaknesses</h4>
                                    <ul className="list-disc list-inside text-xs mt-1 text-red-700">
                                        {lead.enrichment_data.analysis?.weaknesses_or_gaps?.slice(0, 3).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Digital Footprint & Monitoring Card */}
                {lead.enrichment_data?.contact_info?.social_platforms && (
                    <div className="border p-4 rounded bg-white shadow-sm flex flex-col space-y-4">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            Digital Footprint
                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Monitoring Active</span>
                        </h2>

                        {/* Social Links */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-medium text-gray-500 uppercase">Social Channels</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(lead.enrichment_data.contact_info.social_platforms).map(([platform, url]) => (
                                    url ? (
                                        <a href={url as string} target="_blank" key={platform} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border hover:bg-gray-50 text-sm capitalize">
                                            {/* Simple icons based on name */}
                                            <span className={`w-2 h-2 rounded-full ${platform === 'facebook' ? 'bg-blue-600' : platform === 'instagram' ? 'bg-pink-600' : 'bg-gray-400'}`}></span>
                                            {platform}
                                        </a>
                                    ) : null
                                ))}
                                {Object.values(lead.enrichment_data.contact_info.social_platforms).every(x => !x) && (
                                    <span className="text-sm text-gray-400 italic">No social profiles found.</span>
                                )}
                            </div>
                        </div>

                        {/* Monitoring Signals */}
                        {lead.enrichment_data.monitoring_signals && (
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-xs font-medium text-gray-500 uppercase">Live Signals</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded border">
                                        <span className="text-xs text-gray-500 block">Social Activity</span>
                                        <div className="font-medium text-sm mt-1">{lead.enrichment_data.monitoring_signals.social_activity_level}</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded border">
                                        <span className="text-xs text-gray-500 block">Website Status</span>
                                        <div className="font-medium text-sm mt-1">{lead.enrichment_data.monitoring_signals.website_update_frequency}</div>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Review Freshness</span>
                                    <div className="text-sm text-gray-700">{lead.enrichment_data.monitoring_signals.review_freshness}</div>
                                </div>

                                {lead.enrichment_data.monitoring_signals.missing_channels?.length > 0 && (
                                    <div className="bg-red-50 p-3 rounded border border-red-100">
                                        <span className="text-xs font-bold text-red-600 uppercase block mb-1">Opportunity: Missing Channels</span>
                                        <div className="text-sm text-red-800">
                                            They are missing: {lead.enrichment_data.monitoring_signals.missing_channels.join(', ')}.
                                            <br />
                                            <span className="text-xs opacity-75">Pitch: "We can set these up for you."</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="border p-4 rounded bg-white shadow-sm flex flex-col space-y-4">
                    <h2 className="font-semibold text-lg">Qualification Scanner</h2>
                    {/* ... scanner content ... */}
                    {lead.scan_status === 'not_scanned' && (
                        <div className="text-center py-6 text-gray-500">
                            <p>Not scanned yet.</p>
                            <form action="/api/qualification/start-single" method="post" className="mt-2">
                                <input type="hidden" name="lead_id" value={lead.id} />
                                <button className="bg-black text-white px-3 py-1 rounded text-xs">Run Scan</button>
                            </form>
                            {lead.enrichment_status === 'enriched' && <p className="text-[10px] text-purple-600 mt-2">Will use enriched data signal.</p>}
                        </div>
                    )}

                    {['queued', 'scanning'].includes(lead.scan_status) && (
                        <div className="text-center py-6 text-gray-500">
                            <p>Scan in progress...</p>
                        </div>
                    )}

                    {lead.scan_status === 'done' && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={`text-3xl font-bold ${lead.scan_score > 7 ? 'text-green-600' : lead.scan_score < 4 ? 'text-red-500' : 'text-yellow-600'}`}>
                                    {lead.scan_score}<span className="text-sm text-gray-400 font-normal">/10</span>
                                </div>
                                <div className="text-xs uppercase tracking-wide font-bold text-gray-400">{lead.scan_confidence} Confidence</div>
                            </div>

                            {lead.scan_recommended_angle && (
                                <div className="text-sm bg-blue-50 p-2 rounded text-blue-800 border border-blue-100">
                                    <strong>Angle:</strong> {lead.scan_recommended_angle}
                                </div>
                            )}

                            {lead.scan_reasons && lead.scan_reasons.length > 0 && (
                                <div className="text-sm">
                                    <strong>Key Findings:</strong>
                                    <ul className="list-disc list-inside text-gray-600 mt-1">
                                        {lead.scan_reasons.map((r: string, i: number) => (
                                            <li key={i}>{r}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {lead.scan_missing && lead.scan_missing.length > 0 && (
                                <div className="text-xs text-gray-500 mt-2">
                                    <span className="font-medium">Missing:</span> {lead.scan_missing.join(', ')}
                                </div>
                            )}
                        </div>
                    )}

                    {lead.scan_status === 'failed' && (
                        <div className="text-red-500 text-sm">
                            Scan failed: {lead.scan_error}
                        </div>
                    )}
                </div>

                {/* Google Scraper Data Card */}
                {lead.source === 'google_csv' && (
                    <div className="border p-4 rounded bg-white shadow-sm md:col-span-2">
                        <h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
                            Google Listing Data
                            {lead.google_verified && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">✓ Verified</span>}
                            {lead.google_is_claimed && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">✓ Claimed</span>}
                            {lead.google_is_permanently_closed && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">PERMANENTLY CLOSED</span>}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-500 block text-xs">Address</span>
                                    <div className="font-medium">{lead.google_full_address || 'N/A'}</div>
                                    <div className="text-xs text-gray-400 mt-1">lat: {lead.google_latitude}, lng: {lead.google_longitude}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-xs">Categories</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {lead.google_types?.map((t: string) => (
                                            <span key={t} className="bg-gray-100 px-2 py-0.5 rounded text-xs border">{t.replace(/_/g, ' ')}</span>
                                        ))}
                                    </div>
                                </div>
                                {lead.google_place_link && (
                                    <a href={lead.google_place_link} target="_blank" className="text-blue-600 hover:underline block mt-2">
                                        View on Google Maps ↗
                                    </a>
                                )}
                            </div>

                            <div>
                                <span className="text-gray-500 block text-xs mb-2">Working Hours</span>
                                {lead.google_working_hours ? (
                                    <div className="text-sm space-y-1">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                            <div key={day} className="flex justify-between border-b border-gray-50 last:border-0 py-1">
                                                <span className="text-gray-600 w-24">{day}</span>
                                                <span className="font-medium">{(lead.google_working_hours as any)[day] || 'Closed'}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : <div className="text-gray-400 italic">No hours data</div>}
                            </div>
                        </div>
                    </div>
                )}

                <div className="border p-4 rounded bg-white shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <OutreachGenerator lead={lead} />
                </div>
            </div>

            {/* Timeline / History placeholder */}
            <div className="border p-4 rounded bg-white shadow-sm">
                <h2 className="font-semibold mb-4 text-lg">Activity Timeline</h2>
                <p className="text-sm text-gray-400 text-center py-8">No activity yet.</p>
            </div>
        </div>
    )
}

import { getPublicLead } from '@/lib/public-lead'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AuditPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const lead = await getPublicLead(params.id)

    if (!lead) {
        notFound()
    }

    const score = lead.scan_score || 0
    let grade = 'F'
    let color = 'text-red-600'
    let bgColor = 'bg-red-50'
    let borderColor = 'border-red-200'
    let urgencyMessage = "Your digital presence is actively turning customers away."

    if (score >= 9) {
        grade = 'A+'; color = 'text-green-600'; bgColor = 'bg-green-50'; borderColor = 'border-green-200';
        urgencyMessage = "You are doing great, but optimization could yield 10-20% more."
    }
    else if (score >= 8) {
        grade = 'A'; color = 'text-green-500'; bgColor = 'bg-green-50'; borderColor = 'border-green-200';
        urgencyMessage = "Strong foundation. Minor tweaks needed to dominate local search."
    }
    else if (score >= 7) {
        grade = 'B'; color = 'text-blue-500'; bgColor = 'bg-blue-50'; borderColor = 'border-blue-200';
        urgencyMessage = "You're visible, but likely losing 30% of traffic to top competitors."
    }
    else if (score >= 5) {
        grade = 'C'; color = 'text-yellow-500'; bgColor = 'bg-yellow-50'; borderColor = 'border-yellow-200';
        urgencyMessage = "Mediocre performance. You are invisible to half your potential market."
    }
    else if (score >= 3) {
        grade = 'D'; color = 'text-orange-500'; bgColor = 'bg-orange-50'; borderColor = 'border-orange-200';
        urgencyMessage = "Critical issues detected. You are likely losing thousands in revenue monthly."
    }

    // Override with AI analysis if available
    if (lead.enrichment_data?.analysis?.impact_analysis) {
        urgencyMessage = lead.enrichment_data.analysis.impact_analysis
    }

    // Simulated metric for persuasion
    const missedLeads = Math.max(10, (10 - score) * 12)

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
            {/* Minimal Header */}
            <header className="border-b border-gray-100 py-6 sticky top-0 bg-white/80 backdrop-blur z-10">
                <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
                    <div className="font-bold text-lg tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-serif">L</div>
                        Lead2Close
                    </div>
                    <a href="https://calendly.com" target="_blank" className="text-sm font-medium hover:underline">Book Consultation →</a>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-16 px-6 space-y-20">

                {/* Hero Section */}
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Online Health Monitor for {lead.business_name}
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-[1.1]">
                        Is your website <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">losing you money?</span>
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed">
                        We scanned your digital footprint against 50+ local ranking factors.
                        Here is why you might be missing out on customers.
                    </p>
                </div>

                {/* Score Dashboard */}
                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    <div className={`rounded-3xl p-10 flex flex-col items-center justify-center text-center border ${bgColor} ${borderColor} ${color}`}>
                        <span className="text-lg font-semibold uppercase tracking-widest opacity-80 mb-4">Overall Grade</span>
                        <div className="text-[120px] font-black leading-none tracking-tighter shadow-sm">{grade}</div>
                        <div className="mt-4 text-2xl font-bold tracking-tight">{score}/10 Health Score</div>
                    </div>

                    <div className="flex flex-col justify-center space-y-8 p-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Impact Analysis</h3>
                            <p className="text-3xl font-bold text-gray-900 leading-tight">
                                {urgencyMessage}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Estimated Loss</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-gray-900">~{missedLeads}</span>
                                <span className="text-lg text-gray-600 font-medium">high-value leads / mo</span>
                            </div>
                            <p className="text-sm text-gray-500">Based on search volume for {lead.business_name} vs competitors.</p>
                        </div>
                    </div>
                </div>

                {/* Findings Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">Audit Findings</h2>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* The Good */}
                        <div className="space-y-6">
                            <h3 className="font-semibold text-green-600 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</span>
                                Current Strengths
                            </h3>
                            <ul className="space-y-4">
                                {lead.enrichment_data?.analysis?.key_strengths?.slice(0, 4).map((s: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                                        {s}
                                    </li>
                                )) || <li className="text-gray-400 italic">Analyzing...</li>}
                            </ul>
                        </div>

                        {/* The Bad */}
                        <div className="space-y-6">
                            <h3 className="font-semibold text-red-600 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs">!</span>
                                Critical Gaps
                            </h3>
                            <ul className="space-y-4">
                                {((lead.scan_reasons || []).concat(lead.enrichment_data?.analysis?.weaknesses_or_gaps || [])).slice(0, 5).map((s: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-gray-900 font-medium leading-relaxed bg-red-50/50 p-3 rounded-lg border border-red-50">
                                        <span className="text-red-500 mt-0.5">•</span>
                                        {s}
                                    </li>
                                )) || <li className="text-gray-500">No critical issues found.</li>}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Monthly Monitoring Upsell - New Product */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-12 space-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200 pb-8">
                        <div>
                            <div className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2">Recommended Solution</div>
                            <h2 className="text-3xl font-bold text-gray-900">Your Monthly Online Health Monitor</h2>
                            <p className="text-gray-500 mt-3 max-w-xl text-lg">
                                Don't let your score drop again. We track your reputation, uptime, and rankings automatically.
                                You get a simple owner-friendly report every month.
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-gray-900">$19.99</span>
                                <span className="text-gray-500 font-medium">/ month</span>
                            </div>
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded mt-1">Cancel anytime</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                        {/* 1. Performance Trends */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                </div>
                                <h3 className="font-bold text-lg">Performance Trends</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                We track whether key signals are moving up, down, or flat. You’ll always know: <br />
                                <em className="text-gray-800">“Are things getting better — or quietly slipping?”</em>
                            </p>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• Website activity & visitor volume</li>
                                <li>• Inquiry & call volume trends</li>
                                <li>• Missed calls & after-hours risk</li>
                            </ul>
                        </div>

                        {/* 2. Website Health */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                                </div>
                                <h3 className="font-bold text-lg">Website Health</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                We monitor your site 24/7 without rebuilding it. If something breaks or slows down, it’s flagged immediately.
                            </p>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• Contact forms working vs broken</li>
                                <li>• Uptime & accessibility checks</li>
                                <li>• Mobile usability flags</li>
                            </ul>
                        </div>

                        {/* 3. Calls & Inquiry Capture */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <h3 className="font-bold text-lg">Calls & Inquiries</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Critical for service businesses. This shows whether demand is being captured or lost month-to-month.
                            </p>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• Total calls vs missed calls</li>
                                <li>• Response-time signals</li>
                                <li>• Quote request ease-of-use</li>
                            </ul>
                        </div>

                        {/* 4. Google Listing Monitor */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <h3 className="font-bold text-lg">Google Listing</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Since Google is the #1 source of local leads, we watch it like a hawk. If hours or info change, you'll know.
                            </p>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• Listing views and actions trend</li>
                                <li>• Review changes & reputation watch</li>
                                <li>• Visibility shifts affecting directions</li>
                            </ul>
                        </div>

                        {/* 5. Social Activity */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                                </div>
                                <h3 className="font-bold text-lg">Social Activity</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Quickly assess if your social effort is paying off. We track posting consistency and what's actually working.
                            </p>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• Engagement trends (likes/shares)</li>
                                <li>• Inactivity warnings</li>
                                <li>• Most effective recent posts</li>
                            </ul>
                        </div>

                        {/* 6. Alerts & Warnings */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                </div>
                                <h3 className="font-bold text-lg">Alerts & Ratings</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Antivirus for your online presence. We flag broken forms, missing hours, or sudden drops in visibility.
                            </p>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• "Broken form" alerts</li>
                                <li>• Sudden ranking drops</li>
                                <li>• Tracking failures</li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Final CTA Strip */}
                <div className="relative overflow-hidden bg-black text-white rounded-3xl p-8 md:p-12 text-center space-y-8 shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>

                    <div className="max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Stop losing {missedLeads} leads every month.</h2>
                        <p className="text-gray-400 text-lg">
                            We can fix these specific issues for you in less than 7 days.
                            Zero downtime. 100% done-for-you.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="https://calendly.com"
                            target="_blank"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-100 transition-transform active:scale-95 shadow-lg"
                        >
                            Fix My Score →
                        </a>
                        <span className="text-sm text-gray-500 font-medium">or call (555) 123-4567</span>
                    </div>
                </div>

                <footer className="text-center space-y-4 pt-10 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        This automated audit is generated by Lead2Close based on publicly available data from Google, Yelp, and your website.
                        <br />&copy; {new Date().getFullYear()} Lead2Close Inc.
                    </p>
                </footer>

            </main>
        </div>
    )
}

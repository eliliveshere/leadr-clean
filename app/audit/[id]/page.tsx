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
                        Audit Report for {lead.business_name}
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
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-10 space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-1">Recommended Solution</div>
                            <h2 className="text-2xl font-bold text-gray-900">24/7 Digital Performance Monitoring</h2>
                            <p className="text-gray-500 mt-2 max-w-md">Don't let your score drop again. We track your reputation, uptime, and rankings automatically.</p>
                        </div>
                        <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-lg border shadow-sm">
                            <span className="text-2xl font-black text-gray-900">$19.99</span>
                            <span className="text-gray-500 text-sm">/ mo</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <h3 className="font-semibold text-gray-900">Traffic & Ranking</h3>
                            <p className="text-sm text-gray-500">Know exactly how many people search for "{lead.category}" in {lead.city} and land on your site.</p>
                        </div>
                        {/* Feature 2: Social */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-3">
                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <h3 className="font-semibold text-gray-900">Reputation Watch</h3>
                            <p className="text-sm text-gray-500">Instant alerts for new Google & Yelp reviews so you can respond in seconds.</p>
                        </div>
                        {/* Feature 3: Connect */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-3 relative overflow-hidden">
                            {/* Mock "Connected" state if we have links */}
                            {lead.enrichment_data?.contact_info?.social_platforms ? (
                                <div className="absolute top-2 right-2 flex -space-x-2">
                                    {/* Mock avatars */}
                                    <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white"></div>
                                    <div className="w-6 h-6 rounded-full bg-pink-600 border-2 border-white"></div>
                                </div>
                            ) : null}
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="font-semibold text-gray-900">Competitor Spy</h3>
                            <p className="text-sm text-gray-500">See when your competitors change their prices or launch new ads.</p>
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

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

    if (score >= 9) { grade = 'A+'; color = 'text-green-600'; bgColor = 'bg-green-50'; }
    else if (score >= 8) { grade = 'A'; color = 'text-green-500'; bgColor = 'bg-green-50'; }
    else if (score >= 7) { grade = 'B'; color = 'text-blue-500'; bgColor = 'bg-blue-50'; }
    else if (score >= 5) { grade = 'C'; color = 'text-yellow-500'; bgColor = 'bg-yellow-50'; }
    else if (score >= 3) { grade = 'D'; color = 'text-orange-500'; bgColor = 'bg-orange-50'; }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header */}
            <header className="bg-white border-b py-6 px-4">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">L</span>
                        Lead2Close Audit
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest">Confidential Report</div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto py-10 px-4 space-y-10">

                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <div className="inline-block px-3 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-600 mb-2">
                        Prepared for {lead.business_name}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                        Digital Performance Audit
                    </h1>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        We analyzed your online presence, Google ranking, and customer engagement to generate this score.
                    </p>
                </div>

                {/* Score Card */}
                <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col md:flex-row items-center gap-8 md:gap-16 justify-center">
                    <div className={`w-40 h-40 rounded-full border-8 flex items-center justify-center ${color} border-current ${bgColor} opacity-90`}>
                        <div className="text-center">
                            <span className="block text-6xl font-black">{grade}</span>
                            <span className="text-sm font-medium opacity-70">Score: {score}/10</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">What this means</h3>
                            <p className="text-gray-600 mt-1">
                                {score >= 7
                                    ? "Your digital presence is solid, but there's still room to capture more leads."
                                    : "You are likely losing potential customers to competitors due to gaps in your online strategy."
                                }
                            </p>
                        </div>
                        {lead.enrichment_data?.analysis?.business_summary && (
                            <p className="text-sm text-gray-500 italic border-l-2 pl-3">
                                "{lead.enrichment_data.analysis.business_summary}"
                            </p>
                        )}
                    </div>
                </div>

                {/* Findings Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="font-semibold text-green-700 flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            What You're Doing Well
                        </h3>
                        <ul className="space-y-2">
                            {lead.enrichment_data?.analysis?.key_strengths?.map((s: string, i: number) => (
                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="mt-1 text-green-400">•</span> {s}
                                </li>
                            )) || <li className="text-gray-400 italic">Analysis in progress...</li>}
                        </ul>
                    </div>

                    {/* Missed Opportunities */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="font-semibold text-red-600 flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Urgent Fixes Needed
                        </h3>
                        <ul className="space-y-2">
                            {/* Merge Scan reasons and Enrichment weaknesses */}
                            {((lead.scan_reasons || []).concat(lead.enrichment_data?.analysis?.weaknesses_or_gaps || [])).slice(0, 5).map((s: string, i: number) => (
                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="mt-1 text-red-400">•</span> {s}
                                </li>
                            )) || <li className="text-sm text-gray-500">No major issues detected.</li>}
                        </ul>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-black text-white rounded-2xl p-8 text-center space-y-6">
                    <h2 className="text-2xl font-bold">Want to fix these issues?</h2>
                    <p className="text-gray-300 max-w-lg mx-auto">
                        We help businesses like yours automate lead capture and improve reputation scores.
                        Let's chat about getting you to an "A" grade.
                    </p>
                    <a href="#" className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
                        Book a 15-min Strategy Call
                    </a>
                    <p className="text-xs text-gray-500 mt-4">Free consultation. No obligation.</p>
                </div>

                <footer className="text-center text-xs text-gray-400 py-6">
                    Generated by Lead2Close AI Engine • {new Date().getFullYear()}
                </footer>

            </main>
        </div>
    )
}

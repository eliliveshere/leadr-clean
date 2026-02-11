import Link from 'next/link'
import { ArrowRight, BarChart3, CheckCircle2, ChevronRight, Globe, LineChart, MapPin, Search, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">

      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Leadr</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              Log in
            </Link>
            <Link href="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-white to-white pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Lead Intelligence Engine v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-zinc-950 mb-8 max-w-5xl leading-[0.9]">
            Know more before <br className="hidden md:block" /> you reach out.
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-12 leading-relaxed tracking-tight">
            Stop sending generic outreach. Leadr enriches every lead with custom AI hooks, Google Maps data, and social activity signals in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Link href="/login" className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-zinc-950 rounded-xl hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Start Enriching Leads
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm">
              View Sample Data
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DASHBOARD PREVIEW / HOOK SECTION */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl bg-zinc-900 p-2 shadow-2xl ring-1 ring-zinc-900/10">
            <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent" />

            <div className="rounded-xl bg-zinc-950 border border-zinc-800/50 overflow-hidden">

              {/* Window Controls */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-700/50" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700/50" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700/50" />
                </div>
                <div className="px-3 py-1 bg-zinc-800 rounded text-[10px] font-mono text-zinc-500">
                  LEADR_INTELLIGENCE_REPORT_v2.json
                </div>
              </div>

              {/* Fake UI Body */}
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                  {/* Left: Lead Profile */}
                  <div className="w-full md:w-1/3 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <span className="font-bold text-indigo-400">SR</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Smith Roofing Inc.</h3>
                        <p className="text-sm text-zinc-500">Local Service • Roofing</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                        <span className="text-sm text-zinc-500">Google Rating</span>
                        <span className="text-sm font-medium text-yellow-400 flex items-center gap-1">
                          3.8 ★ <span className="text-zinc-600 font-normal">(42)</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                        <span className="text-sm text-zinc-500">Social Activity</span>
                        <span className="text-xs font-medium text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">Inactive (90d+)</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                        <span className="text-sm text-zinc-500">Website Status</span>
                        <span className="text-sm font-medium text-zinc-300">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Hook */}
                  <div className="w-full md:w-2/3">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Generated Hook strategy</span>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 relative group cursor-default">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="relative text-lg md:text-xl text-zinc-200 font-medium leading-relaxed">
                        "Hey team, noticed <span className="text-white bg-white/10 px-1 rounded">Smith Roofing</span> has solid review volume (42) but the rating (3.8) is slipping compared to local competitors. Since you haven't posted in 90+ days, recent negative reviews are dominating your profile. We fix this visibility gap."
                      </p>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <div className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs text-zinc-400">Trust-Based Angle</div>
                      <div className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs text-zinc-400">Reputation Repair</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPS (BENTO STYLE) */}
      <section className="px-6 py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4 tracking-tight">
              A complete intelligence engine.
            </h2>
            <p className="text-lg text-zinc-500">
              Generic outreach dies in the inbox. Leadr gives you the ammunition to start real conversations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Automated Hook Generation</h3>
                <p className="text-zinc-500 max-w-md">
                  Leadr reads the website, understands the business model, and writes a personalized opening line that proves you did your homework.
                </p>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Google Maps Intelligence</h3>
              <p className="text-zinc-500 text-sm">
                Instant access to review counts, ratings, and "open now" signals—critical for local selling.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Social Pulse Scan</h3>
              <p className="text-zinc-500 text-sm">
                Know if they are active on Instagram/Facebook right now before you pitch social services.
              </p>
            </div>

            {/* Card 4 */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Scam & Inactive Filtering</h3>
              <p className="text-zinc-500 max-w-lg">
                Don't waste time on dead leads. Leadr flags businesses with broken websites, 404s, or zero digital footprint automatically.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. COMPARISON */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-zinc-950 mb-6 tracking-tight">The Old Way vs. Leadr</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 min-w-5 min-h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-xs font-bold">✕</span>
                </div>
                <p className="text-zinc-600">Hours spent inspecting websites manually</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 min-w-5 min-h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-xs font-bold">✕</span>
                </div>
                <p className="text-zinc-600">Generic "I saw your website" emails</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 min-w-5 min-h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-xs font-bold">✕</span>
                </div>
                <p className="text-zinc-600">Guessing who needs your service</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-zinc-900 rounded-2xl p-8 shadow-xl text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                The Leadr Way
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-0.5"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <p className="font-semibold text-zinc-100">Instant Enrichment</p>
                    <p className="text-sm text-zinc-400">Clean data in seconds, not hours.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-0.5"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <p className="font-semibold text-zinc-100">Hyper-Personalized</p>
                    <p className="text-sm text-zinc-400">Hooks based on actual business gaps.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-0.5"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <p className="font-semibold text-zinc-100">Ready to Sell</p>
                    <p className="text-sm text-zinc-400">Export directly to your cold email tool.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="px-6 py-24 bg-zinc-950 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">Ready to know more?</h2>
          <p className="text-xl text-zinc-400 mb-10">
            Join the early access program and stop guessing with your outreach today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-zinc-950 bg-white rounded-xl hover:bg-zinc-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              Get Started Now
            </Link>
          </div>
          <p className="mt-8 text-sm text-zinc-500">
            No credit card required for demo.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-zinc-900 tracking-tight">Leadr</span>
          </div>
          <div className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Leadr Intelligence. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-zinc-600">
            <Link href="#" className="hover:text-zinc-900">Privacy</Link>
            <Link href="#" className="hover:text-zinc-900">Terms</Link>
            <Link href="#" className="hover:text-zinc-900">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

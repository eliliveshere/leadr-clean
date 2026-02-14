import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, Globe, MapPin,
  Search, ShieldCheck, Sparkles, Zap,
  Layers, database, MousePointer2, AlertCircle,
  X, Check
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-indigo-500 selection:text-white">

      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Leadr</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-200 transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION (Black Background) */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-black text-white">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 max-w-5xl leading-[0.95] md:leading-[0.9]">
            Build and Launch Your <br className="hidden md:block" />
            <span className="text-zinc-400">Entire Cold Email Pipeline</span> <br className="hidden md:block" />
            — In One System.
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed tracking-tight">
            Leadr replaces your scraper, email verifier, enrichment tool, qualification engine, and outreach generator — then pushes campaign-ready leads directly into Instantly.
            <br /><br />
            <span className="text-zinc-300 font-medium">No CSV chaos. No tool stitching. No guesswork.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link href="/login" className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black bg-white rounded-xl hover:bg-zinc-200 transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              Start Building Your Pipeline
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all">
              View Live Demo
            </Link>
          </div>

          <p className="mt-8 text-sm text-zinc-500 font-medium tracking-wide uppercase">
            Outbound infrastructure for modern operators
          </p>
        </div>
      </section>

      {/* 2. THE PROBLEM (White Background) */}
      <section className="px-6 py-24 bg-white text-zinc-900 border-y border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Cold Email Is Broken by <span className="text-red-600">Tool Fragmentation</span>.</h2>
            <p className="text-xl text-zinc-500">
              If you run outbound today, your stack probably looks like this:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* The Old Way */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200 border-dashed">
              <ul className="space-y-4">
                {['Scraper (Google Maps, Apollo)', 'CSV cleanup', 'Email verifier', 'Manual website research', 'AI copy tool', 'Cold email platform', 'CRM'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-400 line-through decoration-zinc-300">
                    <X className="w-5 h-5 text-red-400 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-zinc-200">
                <p className="text-3xl font-bold text-zinc-300 mb-1">Seven tools.</p>
                <p className="text-xl text-zinc-400">Context switching hell.</p>
              </div>
            </div>

            {/* The Leadr Way */}
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-200"></div>
                <div className="space-y-0 relative">
                  {['Source', 'Verify', 'Enrich', 'Qualify', 'Generate', 'Launch'].map((step, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 relative bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 font-bold text-3xl md:text-4xl tracking-tight leading-none group">
                      <span className="h-3 w-3 rounded-full bg-indigo-600 border-4 border-white absolute -left-[5px] z-10 group-hover:scale-125 transition-transform" />
                      <span className="ml-8 text-zinc-900">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pl-8">
                <p className="text-3xl font-bold text-indigo-600 mb-1">One system.</p>
                <p className="text-xl text-zinc-900">Zero duct tape.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Black Background) */}
      <section className="px-6 py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">The Outbound Infrastructure Stack</h2>
            <p className="text-xl text-zinc-400">Leadr turns raw lists into launch-ready campaigns.</p>
          </div>

          <div className="grid gap-12">

            {/* Step 1: Source */}
            <div className="grid md:grid-cols-12 gap-8 border-b border-zinc-800 pb-12">
              <div className="md:col-span-4">
                <h3 className="text-3xl font-bold mb-4 text-white flex items-center gap-3">
                  <span className="text-zinc-600">01</span> Source
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                  Build targeted lead lists in minutes. Scrape Google Maps by city and category, import Apollo lists, or upload your own CSV.
                </p>
                <ul className="space-y-2 text-zinc-500 text-sm font-mono">
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-indigo-500" /> Google Maps Scraping</li>
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-indigo-500" /> Unlimited CSV sources</li>
                </ul>
              </div>
              <div className="md:col-span-8 bg-zinc-900 rounded-xl border border-zinc-800 p-8 flex items-center justify-center">
                {/* Visual Proxy */}
                <div className="flex gap-4 opacity-50">
                  <div className="w-32 h-20 bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="w-32 h-20 bg-zinc-800 rounded-lg animate-pulse delay-100" />
                  <div className="w-32 h-20 bg-zinc-800 rounded-lg animate-pulse delay-200" />
                </div>
              </div>
            </div>

            {/* Step 2: Verify */}
            <div className="grid md:grid-cols-12 gap-8 border-b border-zinc-800 pb-12">
              <div className="md:col-span-4">
                <h3 className="text-3xl font-bold mb-4 text-white flex items-center gap-3">
                  <span className="text-zinc-600">02</span> Verify
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                  Automatically remove risky emails before they hit your sending domains. Protect deliverability and reputation.
                </p>
                <div className="flex gap-2">
                  {['NeverBounce', 'ZeroBounce', 'Reoon'].map(t => (
                    <span key={t} className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-xs text-zinc-400 rounded">{t}</span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-8 bg-zinc-900 rounded-xl border border-zinc-800 p-8 flex items-center justify-center">
                <ShieldCheck className="w-16 h-16 text-emerald-500" />
              </div>
            </div>

            {/* Step 3: Enrich */}
            <div className="grid md:grid-cols-12 gap-8 border-b border-zinc-800 pb-12">
              <div className="md:col-span-4">
                <h3 className="text-3xl font-bold mb-4 text-white flex items-center gap-3">
                  <span className="text-zinc-600">03</span> Enrich
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                  Leadr pulls Google ratings, social activity signals, website health status, and AI-generated hooks. No manual inspection. No tab hopping.
                </p>
                <button className="text-indigo-400 font-medium hover:text-indigo-300 text-sm flex items-center gap-1">
                  See Sample Report <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="md:col-span-8 bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                {/* Mini Report Card UI */}
                <div className="bg-black rounded border border-zinc-800 p-4 max-w-sm mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-white">Acme Inc.</span>
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">Enriched</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-zinc-800 rounded w-3/4" />
                    <div className="h-2 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Qualify */}
            <div className="grid md:grid-cols-12 gap-8 border-b border-zinc-800 pb-12">
              <div className="md:col-span-4">
                <h3 className="text-3xl font-bold mb-4 text-white flex items-center gap-3">
                  <span className="text-zinc-600">04</span> Qualify
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                  Define your ICP ("I sell X to Y"). Leadr scores leads on industry fit, reputation, inactivity, and signal strength. Stop guessing.
                </p>
              </div>
              <div className="md:col-span-8 bg-zinc-900 rounded-xl border border-zinc-800 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">9.2<span className="text-zinc-600 text-lg">/10</span></div>
                  <div className="text-sm text-zinc-500 uppercase tracking-widest">Fit Score</div>
                </div>
              </div>
            </div>

            {/* Step 5: Launch */}
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h3 className="text-3xl font-bold mb-4 text-white flex items-center gap-3">
                  <span className="text-zinc-600">05</span> Launch
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                  Push verified, qualified leads into Instantly via API. Dynamic personalization fields included. Campaign-ready formatting.
                </p>
              </div>
              <div className="md:col-span-8 bg-zinc-900 rounded-xl border border-zinc-800 p-8 flex items-center justify-center">
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-500 transition-colors">
                  <Zap className="w-5 h-5 text-yellow-300" /> Push to Instantly
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DIFFERENTIATION (White Background) */}
      <section className="px-6 py-24 bg-white text-zinc-900">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">This Isn’t a Data Tool. It’s Infrastructure.</h2>
          <p className="text-xl text-zinc-500">Most tools do one thing. Leadr replaces the stack.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-colors">
            <h3 className="text-2xl font-bold mb-2">Not Just Enrichment</h3>
            <p className="text-zinc-500 font-medium mb-4">We replace your sourcing layer.</p>
            <p className="text-sm text-zinc-400 leading-relaxed">Stop paying for Apollo exports just to clean them elsewhere.</p>
          </div>
          <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-colors">
            <h3 className="text-2xl font-bold mb-2">Not Just Personalization</h3>
            <p className="text-zinc-500 font-medium mb-4">We automate qualification logic.</p>
            <p className="text-sm text-zinc-400 leading-relaxed">Don't write AI lines for bad leads. Qualify first, then generate.</p>
          </div>
          <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-colors">
            <h3 className="text-2xl font-bold mb-2">Not Just CSV Export</h3>
            <p className="text-zinc-500 font-medium mb-4">We deploy directly into your campaigns.</p>
            <p className="text-sm text-zinc-400 leading-relaxed">API integrations with Instantly and Smartlead mean no manual uploads.</p>
          </div>
        </div>
      </section>


      {/* 5. WHO IT'S FOR (Black Background) */}
      <section className="px-6 py-24 bg-black text-white border-y border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center tracking-tight">Built for Operators.</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="group p-6 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Cold Email Agencies</h3>
              <p className="text-sm text-zinc-400">Scale campaigns without juggling tools or hiring more researchers.</p>
            </div>
            <div className="group p-6 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                <LayoutIcon />
              </div>
              <h3 className="font-bold text-lg mb-2">SaaS Founders</h3>
              <p className="text-sm text-zinc-400">Build outbound before you hire SDRs.</p>
            </div>
            <div className="group p-6 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                <MousePointer2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Vertical Software</h3>
              <p className="text-sm text-zinc-400">Launch hyper-specific ICP campaigns in days, not months.</p>
            </div>
            <div className="group p-6 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Growth Teams</h3>
              <p className="text-sm text-zinc-400">Replace manual research with automation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTEGRATIONS (White Background) */}
      <section className="px-6 py-24 bg-white text-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Plays Well With Your Stack.</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold px-4 py-2 border border-zinc-200 rounded-lg">Google Maps</span>
            <span className="text-xl font-bold px-4 py-2 border border-zinc-200 rounded-lg">Apollo</span>
            <span className="text-xl font-bold px-4 py-2 border border-zinc-200 rounded-lg">NeverBounce</span>
            <span className="text-xl font-bold px-4 py-2 border border-zinc-200 rounded-lg">ZeroBounce</span>
            <span className="text-xl font-bold px-4 py-2 border border-zinc-200 rounded-lg">Reoon</span>
            <span className="text-xl font-bold px-4 py-2 border border-zinc-200 rounded-lg text-indigo-600">Instantly</span>
          </div>
          <p className="mt-8 text-zinc-500">Bring your tools. We unify them.</p>
        </div>
      </section>

      {/* 7. PRICING (Black Background) */}
      <section className="px-6 py-24 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple SaaS Pricing.</h2>
            <p className="text-zinc-400">No data resale. No lead marketplace. Just infrastructure.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="font-bold text-xl mb-4">Starter</h3>
              <div className="text-4xl font-bold mb-6">$99<span className="text-zinc-500 text-lg font-medium">/month</span></div>
              <p className="text-zinc-400 text-sm mb-8 border-b border-zinc-800 pb-8">Best for solo operators and early-stage founders.</p>
              <ul className="space-y-4 mb-8">
                {['1,000 enrichments', 'Google Maps scraping', 'Email verification integrations', 'AI enrichment + hooks', 'ICP qualification', 'Instantly sync'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-indigo-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-indigo-500 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">Most Popular</div>
              <h3 className="font-bold text-xl mb-4 text-white">Growth</h3>
              <div className="text-4xl font-bold mb-6">$199<span className="text-zinc-500 text-lg font-medium">/month</span></div>
              <p className="text-zinc-400 text-sm mb-8 border-b border-zinc-800 pb-8">Best for agencies and scaling teams.</p>
              <ul className="space-y-4 mb-8">
                {['5,000 enrichments', 'Advanced filtering', 'Multi-campaign deployment', 'Team seats', 'Priority processing'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-indigo-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="font-bold text-xl mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">$399<span className="text-zinc-500 text-lg font-medium">/month</span></div>
              <p className="text-zinc-400 text-sm mb-8 border-b border-zinc-800 pb-8">Built for outbound operators at scale.</p>
              <ul className="space-y-4 mb-8">
                {['Unlimited enrichment (fair use)', 'API access', 'White-label option', 'Agency-ready workflows', 'Priority support'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-indigo-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/login" className="inline-block px-12 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">
              Start Building Your Pipeline
            </Link>
            <p className="mt-4 text-xs text-zinc-500">Cancel anytime. No contracts.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA (White Background) */}
      <section className="px-6 py-32 bg-white text-zinc-900 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">Stop Stitching Tools Together.</h2>
        <p className="text-xl text-zinc-500 mb-10">Build your outbound machine inside Leadr.</p>
        <Link href="/login" className="inline-block px-12 py-4 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Start Building
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
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

function LayoutIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}

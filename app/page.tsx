import Link from 'next/link'
import { ArrowRight, BarChart3, Globe, LineChart, MapPin, Search, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200">

      {/* 1. HERO SECTION */}
      <section className="relative px-6 pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle accent background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-zinc-100 blur-3xl opacity-50 -z-10 rounded-full" />

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 max-w-4xl">
          Know More Before <br className="hidden md:block" /> You Reach Out.
        </h1>

        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-10 leading-relaxed">
          Leadr enriches every lead with AI, Google Maps data, and social activity signals — so your outreach feels personal, not generic.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors shadow-sm">
            Start Enriching Leads
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors shadow-sm">
            See Sample Enrichment
          </Link>
        </div>

        <p className="mt-8 text-sm text-zinc-400 font-medium">
          Built for agencies, outbound teams, and local service marketers.
        </p>

        {/* Dashboard Preview Graphic Suggestion (Optional, kept minimal as requested) */}
        <div className="mt-16 sm:mt-24 w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="px-6 py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-900 mb-10">
            Most outreach fails before it starts.
          </h2>

          <div className="grid gap-6 md:grid-cols-3 text-left">
            {[
              { icon: Users, text: "Generic emails that scream automation" },
              { icon: Search, text: "No insight into the business you're contacting" },
              { icon: LineChart, text: "Manual research that wastes hours" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-zinc-100">
                <div className="p-3 bg-zinc-50 rounded-lg mb-4">
                  <item.icon className="w-6 h-6 text-zinc-400" />
                </div>
                <p className="text-zinc-600 font-medium">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-lg font-semibold text-zinc-900">
            Leadr fixes this in seconds.
          </p>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">AI Business Intelligence</h3>
            <ul className="space-y-3 text-zinc-600">
              <li className="flex items-start"><span className="mr-2 text-zinc-400">•</span>Understands what the company actually does</li>
              <li className="flex items-start"><span className="mr-2 text-zinc-400">•</span>Summarizes positioning</li>
              <li className="flex items-start"><span className="mr-2 text-zinc-400">•</span>Identifies niche + growth angle</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Google Maps Enrichment</h3>
            <ul className="space-y-3 text-zinc-600">
              <li className="flex items-start"><span className="mr-2 text-zinc-400">•</span>Ratings + review count</li>
              <li className="flex items-start"><span className="mr-2 text-zinc-400">•</span>Business hours consistency</li>
              <li className="flex items-start"><span className="mr-2 text-zinc-400">•</span>Category + visibility signals</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Social Activity Scan</h3>
            <ul className="space-y-3 text-zinc-600">
              <li className="flex items-start"><span className="mr-2 text-zinc-400">•</span>Posting frequency</li>
              <li className="flex items-start"><span className="mr-2 text-zinc-400">•</span>Engagement signals</li>
              <li className="flex items-start"><span className="mr-2 text-zinc-400">•</span>Inactive account detection</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-16 pt-8 border-t border-zinc-100">
          <p className="text-zinc-500 font-medium">All combined into one clean enrichment report.</p>
        </div>
      </section>

      {/* 4. OUTPUT SECTION */}
      <section className="px-6 py-24 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Every Lead Gets a Custom Outreach Hook.
          </h2>

          {/* Sample Card */}
          <div className="bg-zinc-800 rounded-2xl p-8 md:p-10 shadow-2xl border border-zinc-700 text-left max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-700/50">
              <div>
                <h3 className="text-xl font-bold text-white">Smith Roofing</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                  <span className="flex items-center gap-1 text-yellow-400"><span className="font-semibold text-white">3.8</span> ★ (42 reviews)</span>
                  <span>•</span>
                  <span className="text-red-400 bg-red-400/10 px-2 py-0.5 rounded">Inactive (last post 90d ago)</span>
                </div>
              </div>
              <div className="hidden sm:block w-10 h-10 rounded-full bg-zinc-700" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">Generated Hook</p>
              <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-700 shadow-inner">
                <p className="text-lg text-zinc-200 leading-relaxed font-medium">
                  "Noticed Smith Roofing has strong reviews but limited recent activity online — tightening visibility could easily increase inbound calls this season."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHO IT'S FOR */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          {["Agencies running cold outreach", "Appointment setters", "Local service marketers", "Sales teams doing outbound"].map((role, i) => (
            <div key={i} className="bg-white p-8 rounded-xl border border-zinc-100 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all text-center flex items-center justify-center min-h-[140px]">
              <p className="text-zinc-800 font-semibold text-lg leading-tight">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. VALUE SECTION */}
      <section className="px-6 py-24 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Replace Manual Research. <br /> Close More Conversations.
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4 mt-12 text-left max-w-2xl mx-auto">
            {[
              "Enrich thousands of leads",
              "Remove guesswork from outreach",
              "Increase reply rates",
              "Identify high-opportunity businesses instantly"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                <span className="text-zinc-700 text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRICING TEASER */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Simple. Scalable. Built for Volume.</h2>
        <p className="text-zinc-500 mb-8">Usage-based enrichment pricing.<br />No bloated CRM. No agency upsell.</p>
        <Link href="/login" className="text-zinc-900 font-semibold hover:text-zinc-700 underline underline-offset-4 decoration-zinc-300">
          Join Early Access
        </Link>
      </section>

      {/* 8. FINAL CTA */}
      <section className="px-6 py-24 bg-zinc-900 text-white text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">Stop Guessing. Start Knowing.</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-zinc-900 bg-white rounded-xl hover:bg-zinc-100 transition-colors shadow-lg">
            Start Enriching Leads
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-transparent border border-zinc-700 rounded-xl hover:bg-zinc-800 transition-colors">
            Request Demo
          </Link>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="px-6 py-12 border-t border-zinc-100 text-center text-zinc-400 text-sm">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="font-bold text-zinc-900">Leadr</span>
          <span>•</span>
          <span>Lead Intelligence Engine</span>
        </div>
        <p>© {new Date().getFullYear()} Leadr. All rights reserved.</p>
      </footer>
    </div>
  )
}

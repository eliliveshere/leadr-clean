'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Briefcase, Building2, MapPin, Globe,
    ArrowRight, Check, Zap, ShieldCheck,
    Loader2, Search, Rocket
} from 'lucide-react'
import { toast } from 'sonner'

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)

    // Form State
    const [offering, setOffering] = useState('')
    const [description, setDescription] = useState('')
    const [industry, setIndustry] = useState('')
    const [city, setCity] = useState('')
    const [connectedInstantly, setConnectedInstantly] = useState(false)
    const [connectedVerify, setConnectedVerify] = useState(false)
    const [generating, setGenerating] = useState(false)

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => Math.max(1, s - 1))

    const handleFinish = async () => {
        setGenerating(true)
        // Simulate generation delay
        await new Promise(r => setTimeout(r, 2000))
        toast.success("Pipeline built! 50 leads generated.")
        router.push('/app/leads')
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">

            {/* Progress Header */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-zinc-900">
                        {step === 1 && "What are you selling?"}
                        {step === 2 && "Who is your ideal customer?"}
                        {step === 3 && "Connect your tools"}
                        {step === 4 && "Ready to Launch"}
                    </h1>
                    <span className="text-sm font-medium text-zinc-400">Step {step} of 4</span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 min-h-[400px] relative">
                <AnimatePresence mode="wait">

                    {/* STEP 1: OFFERING */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'saas', label: 'SaaS Product', icon: Globe },
                                    { id: 'agency', label: 'Agency Services', icon: Briefcase },
                                    { id: 'local', label: 'Local Business', icon: MapPin },
                                    { id: 'custom', label: 'Other / Custom', icon: Rocket },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setOffering(type.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all hover:border-indigo-200 group ${offering === type.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-zinc-100 hover:bg-zinc-50'}`}
                                    >
                                        <type.icon className={`w-6 h-6 mb-3 ${offering === type.id ? 'text-indigo-600' : 'text-zinc-400 group-hover:text-indigo-500'}`} />
                                        <div className={`font-semibold ${offering === type.id ? 'text-indigo-900' : 'text-zinc-700'}`}>{type.label}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Short Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="I help dental practices get more patients using AI ads..."
                                    className="w-full text-zinc-900 p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-24 resize-none"
                                />
                                <p className="text-xs text-zinc-400">We use this to generate your outreach hooks.</p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={nextStep}
                                    disabled={!offering || !description}
                                    className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: ICP */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-zinc-700 mb-1 block">Target Industry</label>
                                    <input
                                        type="text"
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        placeholder="e.g. Dentists, SaaS Founders, Roofers"
                                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-900"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-zinc-700 mb-1 block">Location</label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="e.g. Austin, TX (or Remote)"
                                        className="text-zinc-900 w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-indigo-50 rounded-xl p-4 flex gap-3 items-start">
                                <Search className="w-5 h-5 text-indigo-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-indigo-900 text-sm">Real-time Validation</h4>
                                    <p className="text-indigo-700 text-xs mt-1">We'll use these settings to source your first 50 leads from Google Maps & our database.</p>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between items-center">
                                <button onClick={prevStep} className="text-zinc-500 hover:text-zinc-900 text-sm font-medium">Back</button>
                                <button
                                    onClick={nextStep}
                                    disabled={!industry}
                                    className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: INTEGRATIONS */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <p className="text-zinc-500 text-sm">Connect your stack to enable one-click export. You can skip this for now.</p>

                            {/* Instantly Card */}
                            <div className={`p-4 rounded-xl border transition-all ${connectedInstantly ? 'border-emerald-200 bg-emerald-50' : 'border-zinc-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                            <Zap className="w-5 h-5 text-yellow-300" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-zinc-900">Instantly.ai</h4>
                                            <p className="text-xs text-zinc-500">For sending campaigns</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setConnectedInstantly(!connectedInstantly)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${connectedInstantly ? 'bg-white text-emerald-600 border border-emerald-200' : 'bg-zinc-900 text-white hover:bg-black'}`}
                                    >
                                        {connectedInstantly ? 'Connected' : 'Connect'}
                                    </button>
                                </div>
                            </div>

                            {/* Verification Card */}
                            <div className={`p-4 rounded-xl border transition-all ${connectedVerify ? 'border-emerald-200 bg-emerald-50' : 'border-zinc-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center border border-zinc-200">
                                            <ShieldCheck className="w-5 h-5 text-zinc-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-zinc-900">NeverBounce</h4>
                                            <p className="text-xs text-zinc-500">For email verification</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setConnectedVerify(!connectedVerify)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${connectedVerify ? 'bg-white text-emerald-600 border border-emerald-200' : 'bg-zinc-900 text-white hover:bg-black'}`}
                                    >
                                        {connectedVerify ? 'Connected' : 'Connect'}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between items-center">
                                <button onClick={prevStep} className="text-zinc-500 hover:text-zinc-900 text-sm font-medium">Back</button>
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-black transition-colors flex items-center gap-2"
                                >
                                    {(!connectedInstantly && !connectedVerify) ? 'Skip & Continue' : 'Continue'} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: LAUNCH */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center py-8"
                        >
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Rocket className="w-10 h-10 text-indigo-600" />
                            </div>

                            <h2 className="text-2xl font-bold text-zinc-900 mb-2">You're all set!</h2>
                            <p className="text-zinc-500 max-w-sm mx-auto mb-8">
                                We're ready to find <span className="font-semibold text-indigo-600 uppercase">{industry}</span> in <span className="font-semibold text-indigo-600 uppercase">{city || "Global"}</span> for your {offering || "business"}.
                            </p>

                            <button
                                onClick={handleFinish}
                                disabled={generating}
                                className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sourcing Leads...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Generate First 50 Leads
                                    </>
                                )}
                            </button>

                            {!generating && (
                                <button onClick={prevStep} className="mt-8 text-sm text-zinc-400 hover:text-zinc-600 block mx-auto">
                                    Change Criteria
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

'use client'

import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function HookCard({ hook }: { hook: string }) {
    const copyHook = () => {
        if (!hook) return
        navigator.clipboard.writeText(hook)
        toast.success("Hook Copied!")
    }

    return (
        <div className="bg-gradient-to-br from-zinc-50 to-white p-5 rounded-xl border border-zinc-200/60 shadow-sm relative group cursor-pointer" onClick={copyHook}>
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl" />
            <p className="text-lg md:text-xl text-zinc-800 font-medium leading-relaxed font-serif italic">
                "{hook || "No hook generated."}"
            </p>
            <button
                className="absolute bottom-4 right-4 p-2 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:shadow-sm text-zinc-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                title="Copy Hook"
            >
                <Copy className="w-4 h-4" />
            </button>
        </div>
    )
}

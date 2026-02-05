'use client'

import { toast } from 'sonner'
import { Link2 } from 'lucide-react'

export default function CopyAuditLink({ id }: { id: string }) {
    const handleCopy = () => {
        const url = `${window.location.origin}/audit/${id}`
        navigator.clipboard.writeText(url)
        toast.success('Audit link copied!')
    }

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
        >
            <Link2 className="w-3 h-3" />
            Copy Audit Link
        </button>
    )
}

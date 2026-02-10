'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Save, X, Globe, Mail, Phone, MapPin, Tag, Star } from 'lucide-react'
import { toast } from 'sonner'

export default function LeadDetailsEditor({ lead }: { lead: any }) {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        phone: lead.phone || '',
        email: lead.email || '',
        website: lead.website_url || lead.website || '',
        city: lead.city || '',
        category: lead.category || '',
        rating: lead.rating ? String(lead.rating) : '',
        has_opt_in: lead.has_opt_in || false
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
        setFormData(prev => ({ ...prev, [e.target.name]: value }))
    }

    const handleSave = async () => {
        const supabase = createClient()
        const { error } = await supabase
            .from('leads')
            .update({
                phone: formData.phone || null,
                email: formData.email || null,
                website: formData.website || null, // Standardizing on 'website' column if possible, but let's check schema. Usually we use website_url based on previous code.
                // Wait, the previous code used `lead.website_url || lead.website`. Let's save to both or prefer one.
                // Actually, let's just save to `email`, `phone`, `city`, `category`.
                // For website, there might be two columns. I'll update `website_url` as primary.
                website_url: formData.website || null,
                city: formData.city || null,
                category: formData.category || null,
                rating: formData.rating ? parseFloat(formData.rating) : null,
                has_opt_in: formData.has_opt_in
            })
            .eq('id', lead.id)

        if (error) {
            toast.error("Failed to save changes")
            return
        }

        toast.success("Lead details updated")
        setIsEditing(false)
        // Ideally we refresh the page or router
        window.location.reload()
    }

    if (isEditing) {
        return (
            <div className="border p-4 rounded bg-white shadow-sm relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">Edit Details</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="space-y-4 text-sm">
                    <div>
                        <label className="block text-gray-500 text-xs mb-1">Phone</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-xs mb-1">Email <span className="text-red-500">* Required for Instantly</span></label>
                        <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded font-medium" />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-xs mb-1">Website</label>
                        <input name="website" value={formData.website} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-500 text-xs mb-1">City</label>
                            <input name="city" value={formData.city} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-gray-500 text-xs mb-1">Category</label>
                            <input name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-500 text-xs mb-1">Rating</label>
                            <input name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input name="has_opt_in" type="checkbox" checked={formData.has_opt_in} onChange={handleChange} className="rounded border-gray-300" />
                            <label className="text-gray-700">Opt-in?</label>
                        </div>
                    </div>

                    <button onClick={handleSave} className="w-full bg-black text-white py-2 rounded flex items-center justify-center gap-2 mt-2">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="border p-4 rounded bg-white shadow-sm relative group">
            <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black hover:bg-gray-100 p-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                title="Edit Details"
            >
                <Pencil className="w-4 h-4" />
            </button>

            <h2 className="font-semibold mb-4 text-lg">Details</h2>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2 items-center">
                    <span className="text-gray-500 flex items-center gap-2"><Phone className="w-3 h-3" /> Phone</span>
                    <span className="font-medium">{lead.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b pb-2 items-center">
                    <span className="text-gray-500 flex items-center gap-2"><Mail className="w-3 h-3" /> Email</span>
                    <span className={`font-medium ${!lead.email ? 'text-red-300 italic' : ''}`}>{lead.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b pb-2 items-center">
                    <span className="text-gray-500 flex items-center gap-2"><Globe className="w-3 h-3" /> Website</span>
                    <span className="font-medium truncate max-w-[200px]">
                        {lead.website_url || lead.website ? (
                            <a href={(lead.website_url || lead.website).startsWith('http') ? (lead.website_url || lead.website) : `https://${lead.website_url || lead.website}`} target="_blank" className="font-medium text-blue-600 hover:underline">
                                {lead.website_url || lead.website}
                            </a>
                        ) : 'N/A'}
                    </span>
                </div>
                <div className="flex justify-between border-b pb-2 items-center">
                    <span className="text-gray-500 flex items-center gap-2"><MapPin className="w-3 h-3" /> City</span>
                    <span className="font-medium">{lead.city || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b pb-2 items-center">
                    <span className="text-gray-500 flex items-center gap-2"><Tag className="w-3 h-3" /> Category</span>
                    <span className="font-medium">{lead.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b pb-2 items-center">
                    <span className="text-gray-500 flex items-center gap-2"><Star className="w-3 h-3" /> Rating</span>
                    <span className="font-medium">{lead.rating ? `${lead.rating} ★` : 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b pb-2 items-center">
                    <span className="text-gray-500">Opt-in</span>
                    <span className="font-medium">{lead.has_opt_in ? 'Yes' : 'No'}</span>
                </div>
            </div>
        </div>
    )
}

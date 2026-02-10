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
        has_opt_in: lead.has_opt_in || false,
        google_maps_url: lead.google_maps_url || '',
        facebook: lead.enrichment_data?.contact_info?.social_platforms?.facebook || '',
        instagram: lead.enrichment_data?.contact_info?.social_platforms?.instagram || '',
        linkedin: lead.enrichment_data?.contact_info?.social_platforms?.linkedin || ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
        setFormData(prev => ({ ...prev, [e.target.name]: value }))
    }

    const handleSave = async () => {
        const supabase = createClient()

        // Prepare Socials Update (Deep merge strategy needed? We'll just overwrite for now)
        const currentEnrichment = lead.enrichment_data || {}
        const currentContactInfo = currentEnrichment.contact_info || {}
        const currentSocials = currentContactInfo.social_platforms || {}

        const newEnrichmentData = {
            ...currentEnrichment,
            contact_info: {
                ...currentContactInfo,
                social_platforms: {
                    ...currentSocials,
                    facebook: formData.facebook || null,
                    instagram: formData.instagram || null,
                    linkedin: formData.linkedin || null
                }
            }
        }

        const { error } = await supabase
            .from('leads')
            .update({
                phone: formData.phone || null,
                email: formData.email || null,
                website_url: formData.website || null,
                city: formData.city || null,
                category: formData.category || null,
                rating: formData.rating ? parseFloat(formData.rating) : null,
                has_opt_in: formData.has_opt_in,
                google_maps_url: formData.google_maps_url || null,
                enrichment_data: newEnrichmentData, // Save updated socials
                enrichment_status: lead.enrichment_status === 'not_enriched' ? 'manually_enriched' : lead.enrichment_status
            })
            .eq('id', lead.id)

        if (error) {
            toast.error("Failed to save changes " + error.message)
            return
        }

        toast.success("Lead details updated")
        setIsEditing(false)
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
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-500 text-xs mb-1">Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-gray-500 text-xs mb-1">City</label>
                            <input name="city" value={formData.city} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-500 text-xs mb-1">Email <span className="text-red-500">*</span></label>
                        <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded font-medium" />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-xs mb-1">Website</label>
                        <input name="website" value={formData.website} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>

                    {/* Socials & Google */}
                    <div className="border-t pt-4 space-y-2">
                        <h3 className="text-xs font-semibold text-gray-900 uppercase">Online Presence</h3>
                        <div>
                            <label className="block text-gray-500 text-xs mb-1">Google Maps Link</label>
                            <input name="google_maps_url" value={formData.google_maps_url} onChange={handleChange} className="w-full border p-2 rounded text-xs" placeholder="https://maps.google.com/..." />
                        </div>
                        <div>
                            <label className="block text-gray-500 text-xs mb-1">Facebook URL</label>
                            <input name="facebook" value={formData.facebook} onChange={handleChange} className="w-full border p-2 rounded text-xs" />
                        </div>
                        <div>
                            <label className="block text-gray-500 text-xs mb-1">Instagram URL</label>
                            <input name="instagram" value={formData.instagram} onChange={handleChange} className="w-full border p-2 rounded text-xs" />
                        </div>
                        <div>
                            <label className="block text-gray-500 text-xs mb-1">LinkedIn URL</label>
                            <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full border p-2 rounded text-xs" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <div>
                            <label className="block text-gray-500 text-xs mb-1">Category</label>
                            <input name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded" />
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

                {/* Socials Section */}
                {(lead.google_maps_url || lead.enrichment_data?.contact_info?.social_platforms) && (
                    <div className="pt-2 pb-2 space-y-2 border-b">
                        {lead.google_maps_url && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 flex items-center gap-2"><MapPin className="w-3 h-3" /> Google Maps</span>
                                <a href={lead.google_maps_url} target="_blank" className="text-xs text-blue-600 hover:underline truncate max-w-[150px]">View Listing</a>
                            </div>
                        )}
                        {lead.enrichment_data?.contact_info?.social_platforms?.facebook && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 flex items-center gap-2">Facebook</span>
                                <a href={lead.enrichment_data.contact_info.social_platforms.facebook} target="_blank" className="text-xs text-blue-600 hover:underline truncate max-w-[150px]">profile ↗</a>
                            </div>
                        )}
                        {lead.enrichment_data?.contact_info?.social_platforms?.instagram && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 flex items-center gap-2">Instagram</span>
                                <a href={lead.enrichment_data.contact_info.social_platforms.instagram} target="_blank" className="text-xs text-blue-600 hover:underline truncate max-w-[150px]">profile ↗</a>
                            </div>
                        )}
                        {lead.enrichment_data?.contact_info?.social_platforms?.linkedin && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 flex items-center gap-2">LinkedIn</span>
                                <a href={lead.enrichment_data.contact_info.social_platforms.linkedin} target="_blank" className="text-xs text-blue-600 hover:underline truncate max-w-[150px]">profile ↗</a>
                            </div>
                        )}
                    </div>
                )}

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

'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, Upload, AlertCircle } from 'lucide-react'

// Define our internal standard fields
const TARGET_FIELDS = [
    { key: 'business_name', label: 'Business Name', required: true, aliases: ['company', 'organization', 'business', 'name', 'company_name', 'organizationName'] },
    { key: 'city', label: 'City', required: true, aliases: ['city', 'location', 'organizationCity'] },
    { key: 'category', label: 'Category', required: true, aliases: ['category', 'industry', 'type', 'organizationIndustry'] },
    { key: 'website', label: 'Website', required: false, aliases: ['website', 'url', 'web', 'organizationWebsite'] },
    { key: 'email', label: 'Email', required: false, aliases: ['email', 'contact_email', 'mail'] },
    { key: 'phone', label: 'Phone', required: false, aliases: ['phone', 'mobile', 'tel', 'phone_numbers'] },
    { key: 'first_name', label: 'First Name', required: false, aliases: ['first_name', 'firstname', 'given_name'] },
    { key: 'last_name', label: 'Last Name', required: false, aliases: ['last_name', 'lastname', 'family_name'] },
    { key: 'title', label: 'Job Title', required: false, aliases: ['title', 'job', 'position', 'seniority'] },
    { key: 'linkedin', label: 'LinkedIn URL', required: false, aliases: ['linkedin', 'linkedin_url', 'profile', 'linkedinUrl'] },
]

export default function ImportLeads() {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<'upload' | 'map' | 'importing' | 'done'>('upload')
    const [csvHeaders, setCsvHeaders] = useState<string[]>([])
    const [csvData, setCsvData] = useState<any[]>([])
    const [mapping, setMapping] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)
    const [successCount, setSuccessCount] = useState<number | null>(null)

    const router = useRouter()
    const supabase = createClient()

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.meta.fields && results.meta.fields.length > 0) {
                    setCsvHeaders(results.meta.fields)
                    setCsvData(results.data)
                    initialMapping(results.meta.fields)
                    setStep('map')
                } else {
                    setError("Could not parse CSV headers. Please check the file.")
                }
            },
            error: (err) => {
                setError("Failed to parse CSV: " + err.message)
            }
        })
    }

    const initialMapping = (headers: string[]) => {
        const newMap: Record<string, string> = {}
        TARGET_FIELDS.forEach(field => {
            // Find best match
            const match = headers.find(h =>
                h === field.key ||
                field.aliases.some(alias => h.toLowerCase().replace(/_/g, '').includes(alias.toLowerCase()))
            )
            if (match) {
                newMap[field.key] = match
            }
        })
        setMapping(newMap)
    }

    const handleMapChange = (targetKey: string, csvHeader: string) => {
        setMapping(prev => ({ ...prev, [targetKey]: csvHeader }))
    }

    const executeImport = async () => {
        setStep('importing')
        setError(null)

        try {
            // Validate Required
            const missingRequired = TARGET_FIELDS.filter(f => f.required && !mapping[f.key])
            if (missingRequired.length > 0) {
                throw new Error(`Please map the following required fields: ${missingRequired.map(f => f.label).join(', ')}`)
            }

            const leadsToInsert = csvData.map(row => {
                const getVal = (key: string) => {
                    const header = mapping[key]
                    return header ? (row[header]?.trim() || null) : null
                }

                // Construct base object
                const business_name = getVal('business_name')
                if (!business_name) return null // Skip empty rows

                const category = getVal('category') || 'Unknown'
                const city = getVal('city') || 'Unknown'

                // Extra contact info for Enrichment Data (since we don't have columns yet)
                const firstName = getVal('first_name')
                const lastName = getVal('last_name')
                const title = getVal('title')
                const linkedin = getVal('linkedin')

                const enrichmentData = {
                    email_data: {
                        found_first_name: firstName,
                        found_last_name: lastName,
                        found_title: title
                    },
                    contact_info: {
                        social_platforms: { linkedin: linkedin },
                        emails_found: getVal('email') ? [getVal('email')] : []
                    }
                }

                return {
                    business_name,
                    city,
                    category,
                    website: getVal('website'),
                    website_url: getVal('website'),
                    email: getVal('email'),
                    phone: getVal('phone'),
                    status: 'new',
                    source: 'csv_import',
                    source_raw: row, // Keep original data
                    enrichment_status: 'not_enriched', // or set to 'enriched' if we trust the data? Let's say not_enriched but seeded.
                    enrichment_data: (firstName || linkedin) ? enrichmentData : null,

                    // Default fields
                    scan_status: 'not_scanned',
                    has_opt_in: false
                }
            }).filter(Boolean)

            if (leadsToInsert.length === 0) throw new Error("No valid leads found to import.")

            // Get user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('You must be logged in.')

            const payload = leadsToInsert.map(l => ({ ...l, user_id: user.id }))

            // Batch insert (Supabase limit is usually fine for <1000, but let's be safe if huge)
            const { error: insertError } = await supabase.from('leads').insert(payload)
            if (insertError) throw insertError

            setSuccessCount(payload.length)
            setStep('done')
            router.refresh()

        } catch (err: any) {
            setError(err.message || "Import failed")
            setStep('map') // Go back to map to fix
        }
    }

    const reset = () => {
        setIsOpen(false)
        setStep('upload')
        setCsvHeaders([])
        setCsvData([])
        setMapping({})
        setError(null)
        setSuccessCount(null)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50 hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
                <Upload className="w-4 h-4" /> Import CSV
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Import Leads</h2>
                            <button onClick={reset} className="text-gray-400 hover:text-gray-600">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-sm">Import Error</h3>
                                        <p className="text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            {step === 'upload' && (
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors relative">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-3 pointer-events-none">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Click to upload CSV</p>
                                                <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 text-center">
                                        Supports generic CSV exports from Apollo, LinkedIn, Google, etc.
                                    </div>
                                </div>
                            )}

                            {step === 'map' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-gray-600">
                                        Map columns from your file ({csvData.length} rows) to Leadr fields.
                                    </p>

                                    <div className="space-y-3">
                                        {TARGET_FIELDS.map(field => (
                                            <div key={field.key} className="grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-4 text-sm font-medium text-gray-700 flex items-center gap-1">
                                                    {field.label}
                                                    {field.required && <span className="text-red-500">*</span>}
                                                </div>
                                                <div className="col-span-1 flex justify-center text-gray-300">
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                                <div className="col-span-7">
                                                    <select
                                                        value={mapping[field.key] || ''}
                                                        onChange={(e) => handleMapChange(field.key, e.target.value)}
                                                        className={`w-full text-sm border rounded-lg p-2 ${field.required && !mapping[field.key] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                    >
                                                        <option value="">-- Ignore --</option>
                                                        {csvHeaders.map(h => (
                                                            <option key={h} value={h}>{h} (Example: {csvData[0][h]?.slice(0, 15)}...)</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 'importing' && (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-600 font-medium">Importing your leads...</p>
                                </div>
                            )}

                            {step === 'done' && (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                                    <p className="text-gray-600">Successfully imported {successCount} leads.</p>
                                    <p className="text-sm text-gray-400">They have been added to your list.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                            {step === 'map' && (
                                <>
                                    <button onClick={reset} className="px-4 py-2 text-gray-600 hover:text-black text-sm">Cancel</button>
                                    <button
                                        onClick={executeImport}
                                        className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        Import Leads
                                    </button>
                                </>
                            )}
                            {step === 'done' && (
                                <button
                                    onClick={reset}
                                    className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Done
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

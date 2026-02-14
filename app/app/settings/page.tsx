'use client'

import { useState } from 'react'
import {
    User, Key, CreditCard, Users, Webhook,
    Settings as SettingsIcon, Shield, Copy,
    Plus, Trash2, Check, AlertCircle, Zap
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general')

    const tabs = [
        { id: 'general', label: 'General', icon: SettingsIcon },
        { id: 'api', label: 'API Keys', icon: Key },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'billing', label: 'Billing & Usage', icon: CreditCard },
        { id: 'integrations', label: 'Integrations', icon: Webhook },
    ]

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-zinc-900 mb-8">Settings</h1>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-[500px]">

                    {/* 1. GENERAL */}
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="bg-white p-6 rounded-xl border border-zinc-200">
                                <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-zinc-500 uppercase">First Name</label>
                                        <input type="text" defaultValue="Eli" className="w-full mt-1 p-2 border rounded-md text-sm bg-zinc-50" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-zinc-500 uppercase">Last Name</label>
                                        <input type="text" defaultValue="Developer" className="w-full mt-1 p-2 border rounded-md text-sm bg-zinc-50" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-zinc-500 uppercase">Email Address</label>
                                        <input type="email" defaultValue="eli@example.com" className="w-full mt-1 p-2 border rounded-md text-sm bg-zinc-50" />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm">Save Changes</button>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-zinc-200">
                                <h2 className="text-lg font-semibold mb-4">Default ICP Settings</h2>
                                <p className="text-sm text-zinc-500 mb-4">These settings will pre-fill new campaigns.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-zinc-500 uppercase">Default Industry</label>
                                        <input type="text" placeholder="e.g. SaaS" className="w-full mt-1 p-2 border rounded-md text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-zinc-500 uppercase">Default Location</label>
                                        <input type="text" placeholder="e.g. USA" className="w-full mt-1 p-2 border rounded-md text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. API KEYS */}
                    {activeTab === 'api' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">API Keys</h2>
                                <button className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Create New Key
                                </button>
                            </div>

                            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Name</th>
                                            <th className="px-6 py-3 font-medium">Key Prefix</th>
                                            <th className="px-6 py-3 font-medium">Created</th>
                                            <th className="px-6 py-3 font-medium"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        <tr>
                                            <td className="px-6 py-4 font-medium">Production Key</td>
                                            <td className="px-6 py-4 font-mono text-zinc-500">pk_live_...4829</td>
                                            <td className="px-6 py-4 text-zinc-500">2 days ago</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-medium">Test Environment</td>
                                            <td className="px-6 py-4 font-mono text-zinc-500">pk_test_...9921</td>
                                            <td className="px-6 py-4 text-zinc-500">1 month ago</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>Your API keys carry full administrative access. Do not share them in client-side code.</p>
                            </div>
                        </div>
                    )}

                    {/* 3. TEAM */}
                    {activeTab === 'team' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Team Members</h2>
                                <button className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Invite Member
                                </button>
                            </div>

                            <div className="bg-white rounded-xl border border-zinc-200">
                                <div className="p-4 flex items-center justify-between border-b border-zinc-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">ED</div>
                                        <div>
                                            <div className="font-medium text-zinc-900">Eli Developer (You)</div>
                                            <div className="text-xs text-zinc-500">eli@example.com</div>
                                        </div>
                                    </div>
                                    <span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-xs">Owner</span>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold">JD</div>
                                        <div>
                                            <div className="font-medium text-zinc-900">John Doe</div>
                                            <div className="text-xs text-zinc-500">john@example.com</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-xs">Member</span>
                                        <button className="text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. BILLING */}
                    {activeTab === 'billing' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl border border-zinc-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-zinc-500 text-sm mb-1">Current Plan</p>
                                            <h2 className="text-2xl font-bold">Starter</h2>
                                        </div>
                                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">Active</span>
                                    </div>
                                    <div className="text-sm text-zinc-600 mb-6">$99 / month • Renews Feb 28, 2026</div>
                                    <button className="w-full py-2 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-sm font-medium transition-colors">Manage Subscription</button>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-zinc-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-zinc-500 text-sm">Credit Usage</p>
                                        <span className="text-zinc-900 font-bold text-sm">842 / 1,000</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 rounded-full h-2 mb-4 overflow-hidden">
                                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '84%' }}></div>
                                    </div>
                                    <p className="text-xs text-zinc-500">Resets in 14 days.</p>
                                    <button className="mt-4 w-full py-2 bg-zinc-900 text-white hover:bg-black rounded-lg text-sm font-medium transition-colors">Add Credits</button>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                                    <h3 className="font-semibold text-sm">Invoice History</h3>
                                </div>
                                <div className="p-4 space-y-2">
                                    {[
                                        { date: 'Jan 28, 2026', amount: '$99.00', status: 'Paid' },
                                        { date: 'Dec 28, 2025', amount: '$99.00', status: 'Paid' },
                                    ].map((inv, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 px-2 hover:bg-zinc-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-400">
                                                    <CreditCard className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-zinc-900">{inv.date}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-zinc-600">{inv.amount}</span>
                                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{inv.status}</span>
                                                <button className="text-zinc-400 hover:text-zinc-900"><Copy className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 5. INTEGRATIONS */}
                    {activeTab === 'integrations' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="bg-white p-6 rounded-xl border border-zinc-200">
                                <h2 className="text-lg font-semibold mb-4">Webhook Configuration</h2>
                                <p className="text-sm text-zinc-500 mb-4">Receive real-time updates when leads are enriched or generated.</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-zinc-500 uppercase">Lead Enriched URL</label>
                                        <div className="flex gap-2 mt-1">
                                            <input type="text" placeholder="https://api.your-app.com/webhooks/leadr" className="flex-1 p-2 border rounded-md text-sm" />
                                            <button className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-zinc-200 rounded-xl flex items-center gap-4 bg-emerald-50 border-emerald-200">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <Zap className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-zinc-900">Instantly</h3>
                                        <p className="text-xs text-emerald-600 font-medium">Connected</p>
                                    </div>
                                </div>
                                <div className="p-4 border border-zinc-200 rounded-xl flex items-center gap-4 opacity-60">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <Shield className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-zinc-900">NeverBounce</h3>
                                        <p className="text-xs text-zinc-500">Not Connected</p>
                                    </div>
                                    <button className="ml-auto text-xs bg-white border border-zinc-200 px-3 py-1 rounded hover:bg-zinc-50">Connect</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

import React, { useState, useEffect } from 'react';
import { Search, Share2, Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const AdminSocial = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/social/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error("Failed to fetch social accounts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (platform) => {
        if (window.confirm(`Are you sure you want to disconnect ${platform}?`)) {
            try {
                await api.delete(`/social/accounts/${platform}`);
                setAccounts(accounts.filter(acc => acc.platform !== platform));
            } catch (error) {
                console.error("Failed to delete account", error);
            }
        }
    };

    const getPlatformColor = (platform) => {
        if (platform === 'linkedin') return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        if (platform === 'instagram') return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
        if (platform === 'facebook') return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
        return 'text-gray-900 dark:text-white/60 bg-white/10 border-white/20';
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Social Media Sync</h1>
                    <p className="text-sm text-indigo-200/80 mt-1 font-medium tracking-wide">Manage connected social accounts across the platform.</p>
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Platform</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Profile Name</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Connected At</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-gray-900 dark:text-white/50">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
                                        </div>
                                        Fetching social graphs...
                                    </td>
                                </tr>
                            ) : accounts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-gray-900 dark:text-white/50 font-medium">No social accounts connected yet.</td>
                                </tr>
                            ) : (
                                accounts.map((acc) => (
                                    <tr key={acc.id} className="hover:bg-white/[0.04] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                                    <Share2 size={18} className="text-gray-900 dark:text-white/60" />
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getPlatformColor(acc.platform)}`}>
                                                    {acc.platform}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-900 dark:text-white/80 font-bold">
                                            {acc.profile_name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-900 dark:text-white/60">
                                            {new Date(acc.connected_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button onClick={() => handleDelete(acc.platform)} title="Disconnect" className="p-2 text-gray-900 dark:text-white/40 hover:text-rose-400 hover:bg-rose-400/20 rounded-xl transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSocial;

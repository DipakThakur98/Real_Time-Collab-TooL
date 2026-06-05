import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Users, Activity } from 'lucide-react';
import api from '../../services/api';

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            // In this architecture, each document has its own collaboration room
            const response = await api.get('/documents');
            setRooms(response.data);
        } catch (error) {
            console.error("Failed to fetch rooms", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRooms = rooms.filter(room => 
        room.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Collaboration Rooms</h1>
                    <p className="text-sm text-indigo-200/80 mt-1 font-medium tracking-wide">Monitor active live coding environments and chat sessions.</p>
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="relative flex-grow group z-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 dark:text-white/40 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search rooms by ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-all shadow-inner"
                    />
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Room ID</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Host / Owner</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-16 text-center text-gray-900 dark:text-white/50">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
                                        </div>
                                        Scanning active sessions...
                                    </td>
                                </tr>
                            ) : filteredRooms.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-16 text-center text-gray-900 dark:text-white/50 font-medium">No active collaboration rooms found.</td>
                                </tr>
                            ) : (
                                filteredRooms.map((room) => (
                                    <tr key={room.id} className="hover:bg-white/[0.04] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                                                    <MessageSquare size={18} />
                                                </div>
                                                <p className="text-sm font-mono text-gray-900 dark:text-white/80">{room.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <Users size={14} className="text-gray-900 dark:text-white/40" />
                                                <span className="text-sm text-gray-900 dark:text-white/60 font-mono">{room.owner_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-2.5 w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                                </span>
                                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Active</span>
                                            </div>
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

export default AdminRooms;

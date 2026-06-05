import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, ShieldAlert, UserX, CheckCircle, Mail, Edit } from 'lucide-react';
import api from '../../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleStatusUpdate = async (userId, newStatus) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { status: newStatus });
            setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]';
            case 'suspended': return 'bg-orange-400/10 text-orange-400 border-orange-400/20 shadow-[0_0_10px_rgba(251,146,60,0.2)]';
            case 'banned': return 'bg-rose-400/10 text-rose-400 border-rose-400/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
            default: return 'bg-white/10 text-gray-900 dark:text-white/60 border-white/20';
        }
    };

    const getRoleColor = (role) => {
        if (role === 'super_admin' || role === 'admin') return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
        if (role === 'moderator' || role === 'editor') return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        return 'text-gray-900 dark:text-white/70 bg-white/5 border-white/10';
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">User Grid</h1>
                    <p className="text-sm text-cyan-200/80 mt-1 font-medium tracking-wide">Manage platform access, roles, and security protocols.</p>
                </div>
                <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-sm font-bold text-gray-900 dark:text-white rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 border border-white/10 hover:scale-105 transform">
                    + Provision User
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="relative flex-grow group z-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 dark:text-white/40 group-focus-within:text-cyan-400 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by username, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-white/30 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent outline-none transition-all shadow-inner"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-900 dark:text-white font-bold hover:bg-white/10 transition-colors shadow-lg z-10">
                    <Filter size={16} />
                    Filters
                </button>
            </div>

            {/* Glass Data Table */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">User ID</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Identity</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Access Role</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Joined</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-gray-900 dark:text-white/50">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-10 h-10 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                                        </div>
                                        Decrypting directory data...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-gray-900 dark:text-white/50 font-medium">No users found in the current sector.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.04] transition-colors group">
                                        <td className="px-6 py-5 text-sm font-bold text-gray-900 dark:text-white/40">
                                            #{user.id.toString().padStart(4, '0')}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-gray-900 dark:text-white border border-white/20 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-cyan-200 transition-colors">{user.username}</p>
                                                    <div className="flex items-center gap-1 text-[11px] font-medium text-gray-900 dark:text-white/50 mt-1">
                                                        <Mail size={12} className="text-gray-900 dark:text-white/30" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <select 
                                                value={user.role} 
                                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                                className={`border font-bold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 cursor-pointer outline-none transition-all text-xs uppercase tracking-wider appearance-none ${getRoleColor(user.role)}`}
                                            >
                                                <option value="user" className="bg-[#1a1a2e] text-gray-900 dark:text-white">USER</option>
                                                <option value="editor" className="bg-[#1a1a2e] text-gray-900 dark:text-white">EDITOR</option>
                                                <option value="moderator" className="bg-[#1a1a2e] text-gray-900 dark:text-white">MODERATOR</option>
                                                <option value="admin" className="bg-[#1a1a2e] text-gray-900 dark:text-white">ADMIN</option>
                                                <option value="super_admin" className="bg-[#1a1a2e] text-gray-900 dark:text-white">SUPER_ADMIN</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-900 dark:text-white/50 font-medium">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.status === 'active' ? (
                                                    <button onClick={() => handleStatusUpdate(user.id, 'suspended')} title="Suspend" className="p-2 text-gray-900 dark:text-white/40 hover:text-orange-400 hover:bg-orange-400/20 rounded-xl transition-colors border border-transparent hover:border-orange-400/30">
                                                        <ShieldAlert size={18} />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleStatusUpdate(user.id, 'active')} title="Activate" className="p-2 text-gray-900 dark:text-white/40 hover:text-emerald-400 hover:bg-emerald-400/20 rounded-xl transition-colors border border-transparent hover:border-emerald-400/30">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                
                                                <button onClick={() => handleStatusUpdate(user.id, 'banned')} title="Ban" className="p-2 text-gray-900 dark:text-white/40 hover:text-rose-400 hover:bg-rose-400/20 rounded-xl transition-colors border border-transparent hover:border-rose-400/30">
                                                    <UserX size={18} />
                                                </button>
                                                <button title="Edit" className="p-2 text-gray-900 dark:text-white/40 hover:text-cyan-400 hover:bg-cyan-400/20 rounded-xl transition-colors border border-transparent hover:border-cyan-400/30">
                                                    <Edit size={18} />
                                                </button>
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

export default AdminUsers;

import React, { useState, useEffect } from 'react';
import {
    Instagram,
    Linkedin,
    Facebook,
    Sparkles,
    Calendar,
    CheckCircle2,
    Clock,
    ChevronRight,
    X,
    Link2,
    User,
    Shield,
    TrendingUp,
    ArrowUpRight,
    Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const platforms = [
    {
        id: 'instagram',
        icon: <Instagram size={22} />,
        gradient: 'from-pink-500 to-orange-400',
        bg: 'bg-gradient-to-br from-pink-500 to-orange-400',
        label: 'Instagram',
        description: 'Share visual content and stories',
        placeholder: '@your_instagram_handle'
    },
    {
        id: 'facebook',
        icon: <Facebook size={22} />,
        gradient: 'from-blue-700 to-blue-500',
        bg: 'bg-gradient-to-br from-blue-700 to-blue-500',
        label: 'Facebook',
        description: 'Reach your community and groups',
        placeholder: 'Your Facebook Page Name'
    },
    {
        id: 'linkedin',
        icon: <Linkedin size={22} />,
        gradient: 'from-blue-500 to-cyan-600',
        bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        label: 'LinkedIn',
        description: 'Publish professional content',
        placeholder: 'Your LinkedIn Profile / Company Name'
    },
];

const ConnectModal = ({ platform, onClose, onSuccess }) => {
    const [profileName, setProfileName] = useState('');
    const [connecting, setConnecting] = useState(false);
    const { showToast } = useToast();

    const handleConnect = async () => {
        if (!profileName.trim()) {
            showToast('Please enter your account name', 'warning');
            return;
        }
        setConnecting(true);
        try {
            await api.post('/social/accounts/connect', {
                platform: platform.id,
                profile_name: profileName,
                token: 'simulated_oauth_' + Date.now()
            });
            showToast(`${platform.label} connected successfully! 🎉`, 'success');
            onSuccess();
            onClose();
        } catch (error) {
            const msg = error.response?.data?.error || error.message;
            showToast(`Connection failed: ${msg}`, 'error');
        } finally {
            setConnecting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 text-gray-400 dark:text-gray-500 transition-all">
                    <X size={20} />
                </button>

                {/* Platform Badge */}
                <div className={`w-16 h-16 ${platform.bg} text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl mb-8`}>
                    {platform.icon}
                </div>

                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Connect {platform.label}</h3>
                <p className="text-gray-400 dark:text-gray-500 font-medium mb-8">{platform.description}</p>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                        <Shield size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Simulated OAuth connection — no real credentials needed for demo.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} /> Account / Page Name
                        </label>
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                            placeholder={platform.placeholder}
                            autoFocus
                            className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-200 rounded-2xl outline-none font-bold text-gray-800 dark:text-gray-200 transition-all"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-gray-50 dark:bg-slate-800/50 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConnect}
                        disabled={connecting || !profileName.trim()}
                        className={`flex-2 flex-grow py-4 ${platform.bg} text-white rounded-2xl font-black text-sm transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                        {connecting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <Link2 size={18} />
                                Connect {platform.label}
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const UpdateModal = ({ platform, account, onClose, onSuccess }) => {
    const [profileName, setProfileName] = useState(account.profile_name || '');
    const [updating, setUpdating] = useState(false);
    const { showToast } = useToast();

    const handleUpdate = async () => {
        if (!profileName.trim()) {
            showToast('Please enter your account name', 'warning');
            return;
        }
        setUpdating(true);
        try {
            await api.put(`/social/accounts/${platform.id}`, {
                profile_name: profileName
            });
            showToast(`${platform.label} updated successfully! ✨`, 'success');
            onSuccess();
            onClose();
        } catch (error) {
            const msg = error.response?.data?.error || error.message;
            showToast(`Update failed: ${msg}`, 'error');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 text-gray-400 dark:text-gray-500 transition-all">
                    <X size={20} />
                </button>

                <div className={`w-16 h-16 ${platform.bg} text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl mb-8`}>
                    {platform.icon}
                </div>

                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Update {platform.label}</h3>
                <p className="text-gray-400 dark:text-gray-500 font-medium mb-8">Edit your connected profile details.</p>

                <div className="space-y-4 mb-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} /> Account / Page Name
                        </label>
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                            placeholder={platform.placeholder}
                            autoFocus
                            className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-200 rounded-2xl outline-none font-bold text-gray-800 dark:text-gray-200 transition-all"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-gray-50 dark:bg-slate-800/50 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={updating || !profileName.trim()}
                        className={`flex-2 flex-grow py-4 ${platform.bg} text-white rounded-2xl font-black text-sm transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                        {updating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Edit2 size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const SocialDashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connectingPlatform, setConnectingPlatform] = useState(null);
    const [updatingPlatform, setUpdatingPlatform] = useState(null);
    const [disconnecting, setDisconnecting] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchSocialData();
    }, []);

    const fetchSocialData = async () => {
        setLoading(true);
        try {
            const [accRes, postRes] = await Promise.all([
                api.get('/social/accounts'),
                api.get('/social/posts/history')
            ]);
            setAccounts(accRes.data);
            setPosts(postRes.data);
        } catch (error) {
            const msg = error.response?.data?.error || error.message;
            showToast(`Failed to load social data: ${msg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async (platformId) => {
        setDisconnecting(platformId);
        try {
            await api.delete(`/social/accounts/${platformId}`);
            showToast(`Account disconnected`, 'success');
            fetchSocialData();
        } catch (error) {
            const msg = error.response?.data?.error || error.message;
            showToast(`Failed to disconnect: ${msg}`, 'error');
        } finally {
            setDisconnecting(null);
        }
    };



    const connectedCount = accounts.length;

    return (
        <>
            <div className="space-y-12">
                {/* Stats Banner */}
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { label: 'Connected Platforms', value: `${connectedCount} / 3`, icon: <Link2 size={20} className="text-indigo-600 dark:text-indigo-400" />, bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
                        { label: 'Posts Scheduled', value: posts.length, icon: <Calendar size={20} className="text-purple-600" />, bg: 'bg-purple-50' },
                        { label: 'Total Reach', value: '42.8k', icon: <TrendingUp size={20} className="text-emerald-600" />, bg: 'bg-emerald-50' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-5"
                        >
                            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{stat.value}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Platform Cards */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Social Accounts</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Connect your platforms to enable automated publishing.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {platforms.map((platform, i) => {
                            const connected = accounts.find(acc => acc.platform === platform.id);
                            return (
                                <motion.div
                                    key={platform.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -6 }}
                                    className={`p-8 rounded-[2.5rem] border-2 transition-all ${connected
                                            ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-100/80'
                                            : 'bg-gray-50 dark:bg-slate-800/50/50 border-dashed border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {/* Top Row */}
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`w-14 h-14 ${platform.bg} text-white rounded-[1.2rem] flex items-center justify-center shadow-xl`}>
                                            {platform.icon}
                                        </div>
                                        {connected ? (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                                <CheckCircle2 size={10} /> Active
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                                Not Connected
                                            </span>
                                        )}
                                    </div>

                                    {/* Platform Info */}
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white">{platform.label}</h4>
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1 mb-2">{platform.description}</p>

                                    {connected && (
                                        <p className="text-sm font-black text-gray-600 bg-gray-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl inline-block mt-2">
                                            {connected.profile_name}
                                        </p>
                                    )}

                                    {/* Action Button */}
                                    <div className="mt-8 flex flex-col gap-3">
                                        {connected ? (
                                            <>
                                                <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-2xl">
                                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                                    <span className="text-sm font-black text-emerald-700">Account Connected</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setUpdatingPlatform({ platform, account: connected })}
                                                        className="flex-1 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Edit2 size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDisconnect(platform.id)}
                                                        disabled={disconnecting === platform.id}
                                                        className="flex-1 py-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        {disconnecting === platform.id ? (
                                                            <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                                        ) : (
                                                            <X size={14} />
                                                        )}
                                                        Disconnect
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setConnectingPlatform(platform)}
                                                className={`w-full py-4 bg-gradient-to-r ${platform.gradient} text-white rounded-2xl text-sm font-black hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 group`}
                                            >
                                                <Link2 size={18} />
                                                Connect {platform.label}
                                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Publishing Queue */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Publishing Queue</h3>

                        {loading ? (
                            <div className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 rounded-full animate-spin" />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 p-14 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 text-center">
                                <Clock size={52} className="mx-auto text-gray-200 mb-5" />
                                <h4 className="text-lg font-black text-gray-300 dark:text-gray-600 mb-2">No posts scheduled yet</h4>
                                <p className="text-gray-400 dark:text-gray-500 font-medium text-sm">Publish a blog from AI Studio to see automated posts here.</p>
                            </div>
                        ) : (
                            posts.map((post, i) => {
                                const plat = platforms.find(p => p.id === post.platform);
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={post.id}
                                        className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-6"
                                    >
                                        <div className={`w-12 h-12 ${plat?.bg || 'bg-gray-400'} text-white rounded-xl flex items-center justify-center shrink-0`}>
                                            {plat?.icon}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Blog:</span>
                                                <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{post.blog_title || 'Untitled'}</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-1">{post.caption}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest mb-1 ${post.status === 'published' ? 'text-emerald-600' : 'text-amber-600'
                                                }`}>
                                                {post.status === 'published' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                {post.status}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* AI Automation Hub */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">AI Automation</h3>
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20">
                            <Sparkles className="mb-6" size={32} />
                            <h4 className="text-xl font-black mb-3 leading-tight">AI Content Strategist</h4>
                            <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-8">
                                Let AI analyze your blog and generate high-engagement campaigns across all connected platforms instantly.
                            </p>
                            <button className="w-full py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-sm hover:bg-indigo-50 dark:bg-indigo-900/30 transition-all shadow-xl flex items-center justify-center gap-2 group">
                                Launch AI Campaign <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                            <h4 className="font-black text-gray-900 dark:text-white mb-6">Quick Stats</h4>
                            <div className="space-y-5">
                                {[
                                    { label: 'Reach', value: '42.8k', change: '+12%' },
                                    { label: 'Clicks', value: '2.4k', change: '+8%' },
                                    { label: 'Engagement', value: '4.2%', change: '+2%' },
                                ].map(stat => (
                                    <div key={stat.label} className="flex justify-between items-center">
                                        <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</p>
                                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                                <ArrowUpRight size={10} />{stat.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Connect Modal */}
            <AnimatePresence>
                {connectingPlatform && (
                    <ConnectModal
                        platform={connectingPlatform}
                        onClose={() => setConnectingPlatform(null)}
                        onSuccess={fetchSocialData}
                    />
                )}
                {updatingPlatform && (
                    <UpdateModal
                        platform={updatingPlatform.platform}
                        account={updatingPlatform.account}
                        onClose={() => setUpdatingPlatform(null)}
                        onSuccess={fetchSocialData}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default SocialDashboard;

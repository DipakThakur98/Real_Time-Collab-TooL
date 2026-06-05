import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { 
    LayoutDashboard, 
    FileText, 
    Share2, 
    BarChart3, 
    Users, 
    Settings, 
    Sparkles, 
    LogOut,
    Bell,
    User,
    Lock,
    Shield,
    HelpCircle,
    ChevronDown,
    Moon,
    Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = ({ children }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [activeUsersCount, setActiveUsersCount] = useState(1);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data);
            } catch (err) {
                console.error('Failed to fetch notifications', err);
            }
        };
        if (user) {
            fetchNotifications();
        }

        const token = sessionStorage.getItem('token');
        let socketInstance;
        
        import('../services/socket').then(({ initiateSocketConnection }) => {
            socketInstance = initiateSocketConnection(token);
            socketInstance.on('active-users-count', (count) => {
                setActiveUsersCount(count);
            });
            
            if (user) {
                socketInstance.on(`notification-${user.id}`, (newNotif) => {
                    setNotifications(prev => [newNotif, ...prev]);
                });
            }
            socketInstance.on('global-notification', (newNotif) => {
                setNotifications(prev => [newNotif, ...prev]);
            });
        });

        return () => {
            if (socketInstance) {
                socketInstance.off('active-users-count');
                if (user) socketInstance.off(`notification-${user.id}`);
                socketInstance.off('global-notification');
            }
        };
    }, [user]);

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'Content Hub', icon: <FileText size={20} />, path: '/dashboard/content' },
        { name: 'Social Studio', icon: <Share2 size={20} />, path: '/dashboard/social' },
        { name: 'AI Studio', icon: <Sparkles size={20} />, path: '/dashboard/ai' },
        { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/dashboard/analytics' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
    ];

    if (user?.role === 'admin' || user?.role === 'super_admin') {
        menuItems.push({ name: 'Admin Panel', icon: <Shield size={20} />, path: '/admin' });
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-900">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col fixed h-full z-50">
                <div className="p-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 dark:shadow-indigo-950/50 group-hover:scale-110 transition-transform duration-300">
                            <FileText className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Collab<span className="text-indigo-600 dark:text-indigo-400">Tool</span></span>
                    </Link>
                </div>

                <nav className="flex-grow px-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                                location.pathname === item.path 
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:bg-indigo-900/30 hover:text-indigo-600 dark:text-indigo-400'
                            }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="px-4 py-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-5 mb-6 border border-indigo-100 dark:border-indigo-800/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Sparkles size={14} className="text-white" />
                                </div>
                                <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Pro Feature</span>
                            </div>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold leading-relaxed mb-4">Unlock advanced AI automation and analytics.</p>
                            <Link to="/pricing" className="flex items-center justify-center w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                                Upgrade Now
                            </Link>
                        </div>
                    </div>

                    <button 
                        onClick={logout}
                        className="flex items-center gap-4 px-4 py-3.5 w-full text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl font-bold text-sm transition-all"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-72 bg-[#f8fafc] dark:bg-[#0f172a]">
                {/* Top Header */}
                <header className="h-20 bg-white dark:bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-12 sticky top-0 z-40">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white w-48">
                        {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                    </h2>
                    


                    <div className="flex items-center gap-4 md:gap-6 justify-end">
                        <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100" title="Active users on the website">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-black text-green-700 tracking-widest uppercase">{activeUsersCount} Online</span>
                        </div>

                        <div className="relative">
                            <button 
                                onClick={toggleTheme}
                                className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:text-indigo-400 bg-gray-50 dark:bg-slate-800 dark:hover:text-indigo-400 rounded-xl transition-all mr-2"
                                title="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>

                            <button 
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:text-indigo-400 bg-gray-50 dark:bg-slate-800 dark:hover:text-indigo-400 rounded-xl transition-all relative"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>
                            
                            <AnimatePresence>
                                {isNotificationOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20/50 border border-gray-100 dark:border-slate-700 py-4 z-50 overflow-hidden"
                                        >
                                            <div className="px-4 pb-3 border-b border-gray-50 dark:border-slate-700/50 flex justify-between items-center">
                                                <h3 className="font-black text-gray-900 dark:text-white">Notifications</h3>
                                                {unreadCount > 0 && (
                                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">{unreadCount} New</span>
                                                )}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">No notifications yet</div>
                                                ) : (
                                                    notifications.map((notif, i) => (
                                                        <div 
                                                            key={i} 
                                                            onClick={() => !notif.is_read && markAsRead(notif.id)}
                                                            className={`p-4 border-b border-gray-50 dark:border-slate-700/50 transition-colors cursor-pointer ${notif.is_read ? 'opacity-60 hover:bg-gray-50 dark:bg-slate-800/50' : 'bg-indigo-50 dark:bg-indigo-900/30/30 hover:bg-indigo-50 dark:bg-indigo-900/30/50'}`}
                                                        >
                                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{notif.title}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.message}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase">
                                                                {new Date(notif.created_at).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <div className="px-4 pt-3 mt-1 text-center border-t border-gray-50 dark:border-slate-700/50">
                                                <button onClick={markAllAsRead} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
                                                    Mark all as read
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="h-8 w-px bg-gray-100"></div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 hover:bg-gray-50 dark:bg-slate-800/50 p-1.5 rounded-2xl transition-all"
                            >
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{user?.username}</p>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                                        {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Administrator' : 'Collaborator'}
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-indigo-100 border-2 border-white shadow-sm rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown size={16} className={`text-gray-400 dark:text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20/50 border border-gray-100 dark:border-slate-700 py-2 z-50 overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-700/50 mb-2">
                                                <p className="text-sm font-black text-gray-900 dark:text-white">{user?.username}</p>
                                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-0.5">{user?.email}</p>
                                            </div>

                                            <div className="px-2 space-y-1">
                                                {[
                                                    { name: 'Edit Profile', icon: <User size={16} />, path: '/dashboard/settings', hash: '#profile' },
                                                    { name: 'Account Security', icon: <Lock size={16} />, path: '/dashboard/settings', hash: '#security' },
                                                    { name: 'Privacy', icon: <Shield size={16} />, path: '/dashboard/settings', hash: '#privacy' },
                                                    { name: 'Settings', icon: <Settings size={16} />, path: '/dashboard/settings', hash: '#settings' },
                                                    { name: 'Help', icon: <HelpCircle size={16} />, path: '/dashboard/settings', hash: '#help' },
                                                ].map((item, i) => (
                                                    <Link 
                                                        key={i}
                                                        to={item.path}
                                                        state={{ activeTab: item.hash.replace('#', '') }}
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:bg-indigo-900/30 rounded-xl transition-colors"
                                                    >
                                                        {item.icon}
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="px-2 mt-2 pt-2 border-t border-gray-50 dark:border-slate-700/50">
                                                <button 
                                                    onClick={() => { setIsProfileOpen(false); logout(); }}
                                                    className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                >
                                                    <LogOut size={16} />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="p-6 sm:p-10 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

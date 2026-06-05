import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
    LayoutDashboard, Users, FileText, Share2, 
    BarChart3, Settings, Bell, Search,
    Terminal, Activity, Sparkles, CreditCard, Flag, FileCode, Moon, Sun, Command, ChevronRight,
    MessageSquare, Zap, PieChart, Globe
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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
        if (user) fetchNotifications();

        const token = sessionStorage.getItem('token');
        let socketInstance;
        
        import('../services/socket').then(({ initiateSocketConnection }) => {
            socketInstance = initiateSocketConnection(token);
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
    
    // Default active menu matches image
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin' },
        { name: 'Users', icon: <Users size={18} />, path: '/admin/users' },
        { name: 'Documents', icon: <FileText size={18} />, path: '/admin/documents' },
        { name: 'Collaboration Rooms', icon: <FileCode size={18} />, path: '/admin/rooms' },
        { name: 'Blogs', icon: <FileText size={18} />, path: '/admin/blogs' },
        { name: 'AI Tools', icon: <Sparkles size={18} />, path: '/admin/ai-tools' },
        { name: 'Social Media', icon: <Share2 size={18} />, path: '/admin/social' },
        { name: 'Analytics', icon: <PieChart size={18} />, path: '/admin/analytics' },
        { name: 'Subscriptions', icon: <CreditCard size={18} />, path: '/admin/subscriptions' },
        { name: 'Payment Orders', icon: <CreditCard size={18} />, path: '/admin/orders' },
        { name: 'Notifications', icon: <Bell size={18} />, path: '/admin/notifications', badge: unreadCount > 0 ? unreadCount : null },
        { name: 'Reports', icon: <Flag size={18} />, path: '/admin/reports' },
        { name: 'Activity Logs', icon: <Activity size={18} />, path: '/admin/logs' },
        { name: 'Settings', icon: <Settings size={18} />, path: '/admin/settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0b0e14] text-slate-700 dark:text-slate-300 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[260px] bg-white dark:bg-[#11131a] border-r border-gray-200 dark:border-[#1e212b] flex flex-col flex-shrink-0 z-50">
                {/* Logo Area */}
                <div className="h-[70px] flex items-center px-6">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                            C
                        </div>
                        <span className="text-gray-900 dark:text-white font-bold text-xl tracking-wide">Collab-Tool</span>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto py-4 scrollbar-hide px-3 space-y-0.5">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
                        return (
                            <Link 
                                key={item.name}
                                to={item.path}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                                    isActive 
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                                    : 'text-gray-500 dark:text-[#8b949e] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.03]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`${isActive ? 'text-white' : 'text-[#8b949e]'}`}>{item.icon}</span>
                                    <span>{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.badge && (
                                        <span className="bg-[#e11d48] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                            {item.badge}
                                        </span>
                                    )}
                                    {isActive && <ChevronRight size={16} className="text-white/70" />}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Section */}
                <div className="p-4 space-y-4">
                    {/* View Public Website */}
                    <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors border border-emerald-500/20">
                        <Globe size={18} />
                        <span>View Public Website</span>
                    </Link>

                    {/* User Profile */}
                    <div className="bg-gray-50 dark:bg-[#1a1d27] border border-gray-200 dark:border-[#262a36] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-[#222532] transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src="https://ui-avatars.com/api/?name=Dipak+Kumar&background=3b82f6&color=fff" alt="Avatar" className="w-9 h-9 rounded-full" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#1a1d27] rounded-full"></span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user?.username || 'Admin'}</p>
                                <p className="text-[11px] text-gray-500 dark:text-[#8b949e] uppercase">{user?.role || 'Super Admin'}</p>
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                {/* Top Header */}
                <header className="h-[70px] bg-white dark:bg-[#0b0e14] flex items-center justify-between px-8 z-40 flex-shrink-0 border-b border-gray-200 dark:border-[#1e212b]">
                    <div className="flex-1">
                        <div className="relative w-[400px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#8b949e]" size={16} />
                            <input 
                                type="text"
                                placeholder="Search anything..."
                                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-[#11131a] border border-gray-200 dark:border-[#1e212b] rounded-xl text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#8b949e] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <span className="bg-[#1e212b] text-[#8b949e] text-[10px] px-1.5 py-0.5 rounded border border-[#2a2e3d]">⌘K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-[#8b949e] hover:text-gray-900 dark:hover:text-white transition-colors">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <div className="relative">
                            <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="relative text-gray-500 dark:text-[#8b949e] hover:text-gray-900 dark:hover:text-white transition-colors">
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e11d48] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#0b0e14]">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)}></div>
                                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#15171e] rounded-2xl shadow-xl border border-gray-200 dark:border-[#1e212b] py-4 z-50 overflow-hidden">
                                        <div className="px-4 pb-3 border-b border-gray-100 dark:border-[#1e212b] flex justify-between items-center">
                                            <h3 className="font-black text-gray-900 dark:text-white">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">{unreadCount} New</span>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-sm text-gray-500 dark:text-[#8b949e]">No notifications yet</div>
                                            ) : (
                                                notifications.map((notif, i) => (
                                                    <div 
                                                        key={i} 
                                                        onClick={() => !notif.is_read && markAsRead(notif.id)}
                                                        className={`p-4 border-b border-gray-100 dark:border-[#1e212b] transition-colors cursor-pointer ${notif.is_read ? 'opacity-60 hover:bg-gray-50 dark:hover:bg-white/[0.03]' : 'bg-indigo-50/30 dark:bg-indigo-500/10 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/20'}`}
                                                    >
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{notif.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-[#8b949e] mt-1">{notif.message}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">
                                                            {new Date(notif.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="px-4 pt-3 mt-1 text-center border-t border-gray-100 dark:border-[#1e212b]">
                                            <button onClick={markAllAsRead} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                                                Mark all as read
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <button className="text-[#8b949e] hover:text-white transition-colors">
                            <Settings size={20} />
                        </button>
                        
                        <div className="flex items-center gap-3 ml-2 border-l border-gray-200 dark:border-[#1e212b] pl-6 cursor-pointer">
                            <img src="https://ui-avatars.com/api/?name=Dipak+Kumar&background=3b82f6&color=fff" alt="Avatar" className="w-9 h-9 rounded-full border border-gray-200 dark:border-[#2a2e3d]" />
                            <div className="hidden sm:block">
                                <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">{user?.username || 'Dipak Kumar'}</p>
                                <p className="text-[11px] text-gray-500 dark:text-[#8b949e] uppercase">{user?.role || 'Super Admin'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-gray-50 dark:bg-[#0b0e14]">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

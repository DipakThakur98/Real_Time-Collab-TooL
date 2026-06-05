import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Menu, X, LogOut, LayoutDashboard, User, Settings, Shield, Plus, ChevronDown, Trash2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, accounts, logout, switchAccount, removeAccount } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const profileDropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutAll = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('accounts');
        window.location.reload();
    };

    const otherAccounts = Object.values(accounts || {}).filter(
        (acc) => acc.user && acc.user.id !== user?.id
    );

    const navLinks = [
        { name: 'Features', path: '/#features' },
        { name: 'Blog', path: '/blog' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-white dark:bg-slate-800/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 dark:shadow-indigo-950/50  group-hover:scale-110 transition-transform duration-300">
                            <FileText className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white ">Collab<span className="text-indigo-600 dark:text-indigo-400">Tool</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-10">
                        <div className="flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    className="text-sm font-bold text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4 relative">
                                <Link 
                                    to="/" 
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30  text-indigo-600 dark:text-indigo-400  rounded-xl font-bold text-sm hover:bg-indigo-100  transition-all active:scale-95"
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                {(user.role === 'admin' || user.role === 'super_admin') && (
                                    <Link 
                                        to="/admin" 
                                        className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all active:scale-95"
                                    >
                                        <Shield size={18} />
                                        Admin Panel
                                    </Link>
                                )}
                                
                                {/* Premium Account Switcher Dropdown */}
                                <div className="relative" ref={profileDropdownRef}>
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-2xl border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md active:scale-98"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-md shadow-indigo-500/20">
                                            {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                                        </div>
                                        <span className="hidden sm:inline text-sm font-black text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                            {user.username}
                                        </span>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-[2.2rem] shadow-2xl border border-gray-100 dark:border-slate-700/80 p-5 space-y-4 z-[110]"
                                            >
                                                {/* Active Account Info */}
                                                <div className="flex items-center gap-3 pb-3 border-b border-gray-50 dark:border-slate-700/50">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg uppercase shadow-xl shadow-indigo-500/20">
                                                        {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="min-w-0 flex-grow">
                                                        <div className="flex items-center gap-1.5">
                                                            <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">{user.full_name || user.username}</h4>
                                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                                (user.role === 'admin' || user.role === 'super_admin') 
                                                                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400' 
                                                                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                                                            }`}>
                                                                {user.role}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                                    </div>
                                                </div>

                                                {/* Other Active Accounts */}
                                                {otherAccounts.length > 0 && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                                                            <Users size={12} />
                                                            <span>Switch Accounts</span>
                                                        </div>
                                                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                                            {otherAccounts.map((acc) => (
                                                                <div 
                                                                    key={acc.user.id}
                                                                    onClick={() => { switchAccount(acc.user.id); setIsProfileOpen(false); }}
                                                                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl cursor-pointer group transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                                        <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center font-black text-xs uppercase group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                            {acc.user.full_name?.charAt(0) || acc.user.username?.charAt(0) || 'U'}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className="text-xs font-black text-gray-700 dark:text-gray-200 truncate">{acc.user.full_name || acc.user.username}</p>
                                                                            <p className="text-[10px] text-gray-400 truncate">{acc.user.email}</p>
                                                                        </div>
                                                                    </div>
                                                                    <button 
                                                                        onClick={(e) => { 
                                                                            e.stopPropagation(); 
                                                                            removeAccount(acc.user.id); 
                                                                        }}
                                                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                                                        title="Remove Account"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Action Options */}
                                                <div className="space-y-1.5 pt-3 border-t border-gray-50 dark:border-slate-700/50">
                                                    <button 
                                                        onClick={() => { navigate('/login'); setIsProfileOpen(false); }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 rounded-2xl transition-colors text-left"
                                                    >
                                                        <Plus size={16} />
                                                        Add Another Account
                                                    </button>
                                                    <button 
                                                        onClick={() => { logout(); setIsProfileOpen(false); }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-black text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-2xl transition-colors text-left"
                                                    >
                                                        <LogOut size={16} />
                                                        Sign Out of {user.username}
                                                    </button>
                                                    {otherAccounts.length > 0 && (
                                                        <button 
                                                            onClick={handleLogoutAll}
                                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/30 rounded-2xl transition-colors text-left"
                                                        >
                                                            <LogOut size={16} />
                                                            Sign Out of All Accounts
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link 
                                    to="/login" 
                                    className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20  hover:bg-indigo-700 transition-all active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex items-center gap-4 lg:hidden">
                        <button 
                            className="p-2 text-gray-600 "
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-white dark:bg-slate-800  border-b border-gray-100 dark:border-slate-700  shadow-2xl lg:hidden p-6 space-y-6 max-h-[85vh] overflow-y-auto"
                    >
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-lg font-bold text-gray-800 dark:text-gray-200  hover:text-indigo-600 dark:text-indigo-400 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-6 border-t border-gray-50 dark:border-slate-700/50  flex flex-col gap-4">
                            {user ? (
                                <>
                                    {/* Current Active Account Card */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100/50 dark:border-slate-700/30">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base uppercase">
                                            {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                                        </div>
                                        <div className="min-w-0 flex-grow">
                                            <p className="font-black text-sm text-gray-900 dark:text-white truncate">{user.full_name || user.username}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Dashboard & Admin Panels */}
                                    <Link 
                                        to="/" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-3.5 bg-indigo-50 dark:bg-indigo-900/30  text-indigo-600 dark:text-indigo-400  rounded-2xl text-center font-black text-sm"
                                    >
                                        Go to Dashboard
                                    </Link>
                                    {(user.role === 'admin' || user.role === 'super_admin') && (
                                        <Link 
                                            to="/admin" 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full py-3.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl text-center font-black text-sm"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}

                                    {/* Other Accounts for Switch */}
                                    {otherAccounts.length > 0 && (
                                        <div className="space-y-2 pt-2 border-t border-gray-50 dark:border-slate-700/30">
                                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Switch Account</p>
                                            <div className="space-y-2">
                                                {otherAccounts.map((acc) => (
                                                    <div 
                                                        key={acc.user.id}
                                                        onClick={() => { switchAccount(acc.user.id); setIsMenuOpen(false); }}
                                                        className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/50 cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-300 flex items-center justify-center font-black text-xs uppercase">
                                                                {acc.user.full_name?.charAt(0) || acc.user.username?.charAt(0) || 'U'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-black text-gray-700 dark:text-gray-200 truncate">{acc.user.full_name || acc.user.username}</p>
                                                                <p className="text-[10px] text-gray-400 truncate">{acc.user.email}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                removeAccount(acc.user.id); 
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-50 dark:border-slate-700/30">
                                        <button 
                                            onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                                            className="w-full py-3.5 border border-indigo-100 dark:border-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} /> Add Account
                                        </button>
                                        <button 
                                            onClick={() => { logout(); setIsMenuOpen(false); }}
                                            className="w-full py-3.5 text-red-600 dark:text-red-400 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20"
                                        >
                                            <LogOut size={16} /> Sign Out of {user.username}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-4 text-center font-bold text-gray-600 "
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-center font-bold shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 "
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

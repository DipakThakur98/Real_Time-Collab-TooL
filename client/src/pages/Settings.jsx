import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Lock, Shield, Settings as SettingsIcon, HelpCircle, 
    Upload, Camera, Check, X, ChevronRight, Bell, Globe, Moon, Monitor, CreditCard
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Settings = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
    
    // Update active tab if location state changes
    React.useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    // Profile State
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        fullName: 'John Doe',
        phone: '+1 234 567 8900',
        bio: 'Product Designer based in San Francisco.',
        avatar: null
    });

    const handleProfileSave = (e) => {
        e.preventDefault();
        showToast('Profile updated successfully!', 'success');
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileData({...profileData, avatar: imageUrl});
            showToast('Profile photo updated!', 'success');
        }
    };

    const tabs = [
        { id: 'profile', name: 'Personal Details', icon: <User size={18} /> },
        { id: 'security', name: 'Account Security', icon: <Lock size={18} /> },
        { id: 'privacy', name: 'Privacy', icon: <Shield size={18} /> },
        { id: 'settings', name: 'General Settings', icon: <SettingsIcon size={18} /> },
        { id: 'help', name: 'Help & Support', icon: <HelpCircle size={18} /> },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your account settings and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {tab.icon}
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Personal Details</h2>
                                    
                                    {/* Profile Photo Section */}
                                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-slate-700">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center">
                                                {profileData.avatar ? (
                                                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{profileData.username?.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center cursor-pointer">
                                                <Camera className="text-white" size={24} />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                            </label>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Profile Photo</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">PNG, JPG up to 5MB</p>
                                            <div className="flex gap-3">
                                                <label className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 hover:border-indigo-600 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-xl cursor-pointer transition-colors">
                                                    Upload new
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                                </label>
                                                <button 
                                                    onClick={() => { setProfileData({...profileData, avatar: null}); showToast('Photo removed', 'success'); }}
                                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-xl transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit Form */}
                                    <form onSubmit={handleProfileSave} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    value={profileData.fullName}
                                                    onChange={e => setProfileData({...profileData, fullName: e.target.value})}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Username</label>
                                                <input 
                                                    type="text" 
                                                    value={profileData.username}
                                                    onChange={e => setProfileData({...profileData, username: e.target.value})}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    value={profileData.email}
                                                    onChange={e => setProfileData({...profileData, email: e.target.value})}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                                                <input 
                                                    type="tel" 
                                                    value={profileData.phone}
                                                    onChange={e => setProfileData({...profileData, phone: e.target.value})}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                                            <textarea 
                                                rows="4"
                                                value={profileData.bio}
                                                onChange={e => setProfileData({...profileData, bio: e.target.value})}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors font-medium resize-none"
                                            ></textarea>
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Account Security</h2>
                                    
                                    <div className="space-y-8">
                                        <div className="p-6 border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50/50 rounded-2xl">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
                                            <form className="space-y-4" onSubmit={e => { e.preventDefault(); showToast('Password updated!', 'success'); }}>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                                                    <input type="password" placeholder="••••••••" className="w-full md:w-2/3 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                                    <input type="password" placeholder="••••••••" className="w-full md:w-2/3 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors" />
                                                </div>
                                                <button type="submit" className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 mt-2">
                                                    Update Password
                                                </button>
                                            </form>
                                        </div>

                                        <div className="flex items-center justify-between p-6 border border-gray-100 dark:border-slate-700 rounded-2xl">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Two-Factor Authentication</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
                                            </div>
                                            <button 
                                                onClick={() => showToast('2FA setup link sent to email', 'success')}
                                                className="px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-bold rounded-xl transition-colors"
                                            >
                                                Enable
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Privacy Preferences</h2>
                                    
                                    <div className="space-y-6">
                                        {[
                                            { title: 'Profile Visibility', desc: 'Make your profile visible to other users on the platform.' },
                                            { title: 'Activity Status', desc: 'Show when you are currently active on the platform.' },
                                            { title: 'Data Sharing', desc: 'Share anonymous usage data to help us improve the product.' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 border border-gray-100 dark:border-slate-700 rounded-2xl">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">General Settings</h2>
                                    
                                    <div className="grid gap-6">
                                        <div className="p-6 border border-gray-100 dark:border-slate-700 rounded-2xl">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Bell size={18} /> Notifications</h3>
                                            <div className="space-y-4">
                                                <label className="flex items-center gap-3">
                                                    <input type="checkbox" className="w-4 h-4 text-indigo-600 dark:text-indigo-400 rounded focus:ring-indigo-600" defaultChecked />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications for updates</span>
                                                </label>
                                                <label className="flex items-center gap-3">
                                                    <input type="checkbox" className="w-4 h-4 text-indigo-600 dark:text-indigo-400 rounded focus:ring-indigo-600" defaultChecked />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications in browser</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="p-6 border border-gray-100 dark:border-slate-700 rounded-2xl">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Monitor size={18} /> Appearance</h3>
                                            <select className="w-full md:w-1/2 px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium">
                                                <option>System Default</option>
                                                <option>Light Theme</option>
                                                <option>Dark Theme</option>
                                            </select>
                                        </div>

                                        <div className="p-6 border border-gray-100 dark:border-slate-700 rounded-2xl">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Globe size={18} /> Language & Region</h3>
                                            <select className="w-full md:w-1/2 px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium">
                                                <option>English (US)</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                                <option>German</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 flex justify-end">
                                        <button 
                                            onClick={() => showToast('Settings saved successfully', 'success')}
                                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                                        >
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'help' && (
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Help & Support</h2>
                                    
                                    <div className="space-y-6">
                                        <div className="p-6 border border-gray-100 dark:border-slate-700 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30/50">
                                            <h3 className="font-bold text-indigo-900 mb-2">Need immediate assistance?</h3>
                                            <p className="text-sm text-indigo-700 mb-4">Our support team is available 24/7 to help you with any issues.</p>
                                            <button 
                                                onClick={() => showToast('Support chat initiated', 'success')}
                                                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
                                            >
                                                Contact Support
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
                                            <div className="space-y-3">
                                                {[
                                                    'How do I invite team members?',
                                                    'Can I upgrade my plan anytime?',
                                                    'Where can I find API documentation?',
                                                ].map((q, i) => (
                                                    <div key={i} className="p-4 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:bg-slate-800/50 cursor-pointer transition-colors flex justify-between items-center group">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">{q}</span>
                                                        <ChevronRight size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Settings;

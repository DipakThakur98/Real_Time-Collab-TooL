import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData.username, formData.fullName, formData.email, formData.password);
            showToast('Account created successfully!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900  flex flex-col items-center justify-center pt-32 pb-16 p-6 transition-colors duration-300">
            <Navbar />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg p-8 sm:p-12 bg-white dark:bg-slate-800  rounded-[3rem] shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20  border border-gray-50 dark:border-slate-700/50  relative overflow-hidden"
            >
                {/* Decorative background blur */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 dark:bg-indigo-900/30  rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50 dark:bg-blue-900/30  rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-10 space-y-2">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30 dark:shadow-indigo-950/50  -rotate-3">
                            <Plus className="text-white" size={32} />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white  tracking-tight">Create Account</h1>
                        <p className="text-gray-500 dark:text-gray-400  font-medium">Join thousands of collaborative teams.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50  border border-red-100  rounded-2xl flex items-center gap-3 text-red-600  text-sm font-bold">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 dark:text-gray-500  uppercase tracking-widest ml-1">Username</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800/50  border-none rounded-2xl focus:ring-4 focus:ring-indigo-100  focus:bg-white dark:bg-slate-800  transition-all duration-300 placeholder:text-gray-300 dark:text-gray-600  font-medium text-gray-900 dark:text-white "
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 dark:text-gray-500  uppercase tracking-widest ml-1">Full Name</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800/50  border-none rounded-2xl focus:ring-4 focus:ring-indigo-100  focus:bg-white dark:bg-slate-800  transition-all duration-300 placeholder:text-gray-300 dark:text-gray-600  font-medium text-gray-900 dark:text-white "
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 dark:text-gray-500  uppercase tracking-widest ml-1">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800/50  border-none rounded-2xl focus:ring-4 focus:ring-indigo-100  focus:bg-white dark:bg-slate-800  transition-all duration-300 placeholder:text-gray-300 dark:text-gray-600  font-medium text-gray-900 dark:text-white "
                                placeholder="name@company.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 dark:text-gray-500  uppercase tracking-widest ml-1">Password</label>
                            <input 
                                type="password" 
                                required 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800/50  border-none rounded-2xl focus:ring-4 focus:ring-indigo-100  focus:bg-white dark:bg-slate-800  transition-all duration-300 placeholder:text-gray-300 dark:text-gray-600  font-medium text-gray-900 dark:text-white "
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-100 dark:shadow-indigo-900/20  transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Create Account</>}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-gray-500 dark:text-gray-400  font-medium">
                        Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400  font-black hover:underline underline-offset-4">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

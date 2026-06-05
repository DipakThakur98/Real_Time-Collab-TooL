import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FileText, AlertCircle, Loader2, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Security Captcha State & References
    const canvasRef = useRef(null);
    const [captchaCode, setCaptchaCode] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    const generateCaptcha = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(code);
        setCaptchaInput('');

        // Draw distorted security captcha on canvas
        setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Styling colors based on dark mode class
            const isDark = document.documentElement.classList.contains('dark');
            ctx.fillStyle = isDark ? '#1e293b' : '#f8fafc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 1. Draw decorative noise lines for OCR protection
            for (let i = 0; i < 5; i++) {
                ctx.strokeStyle = isDark ? `rgba(99, 102, 241, ${0.2 + Math.random() * 0.25})` : `rgba(79, 70, 229, ${0.15 + Math.random() * 0.2})`;
                ctx.lineWidth = 1.5 + Math.random() * 2;
                ctx.beginPath();
                ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.stroke();
            }

            // 2. Draw text with random distortion, angles, and colors
            ctx.font = 'bold 24px monospace';
            ctx.textBaseline = 'middle';

            for (let i = 0; i < code.length; i++) {
                const char = code[i];
                ctx.fillStyle = isDark ? `hsl(${220 + Math.random() * 40}, 85%, 75%)` : `hsl(${220 + Math.random() * 40}, 80%, 45%)`;
                
                ctx.save();
                const x = 16 + i * 22 + Math.random() * 4;
                const y = canvas.height / 2 + (Math.random() * 6 - 3);
                const angle = (Math.random() * 26 - 13) * Math.PI / 180;
                
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.fillText(char, 0, 0);
                ctx.restore();
            }

            // 3. Draw random noise dots for security
            for (let i = 0; i < 35; i++) {
                ctx.fillStyle = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
                ctx.beginPath();
                ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }, 50);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. Verify Captcha code
        if (captchaInput !== captchaCode) {
            setError('Security Captcha code is incorrect (Case Sensitive). Please try again!');
            showToast('Incorrect Captcha!', 'error');
            generateCaptcha();
            setLoading(false);
            return;
        }

        try {
            const user = await login(email, password);
            showToast('Welcome back!');
            if (user.role === 'admin' || user.role === 'super_admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            generateCaptcha(); // Refresh on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900  flex flex-col items-center justify-center pt-32 pb-16 p-6 transition-colors duration-300">
            <Navbar />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg p-8 sm:p-12 bg-white dark:bg-slate-800  rounded-[3rem] shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20  border border-gray-50 dark:border-slate-700/50  relative overflow-hidden"
            >
                {/* Decorative background blur */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 dark:bg-indigo-900/30  rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50 dark:bg-blue-900/30  rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-10 space-y-2">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30 dark:shadow-indigo-950/50  rotate-3">
                            <FileText className="text-white" size={32} />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white  tracking-tight">Welcome Back</h1>
                        <p className="text-gray-500 dark:text-gray-400  font-medium">Continue your collaborative journey.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50  border border-red-100  rounded-2xl flex items-center gap-3 text-red-600  text-sm font-bold animate-pulse">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 dark:text-gray-500  uppercase tracking-widest ml-1">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800/50  border-none rounded-2xl focus:ring-4 focus:ring-indigo-100  focus:bg-white dark:bg-slate-800  transition-all duration-300 placeholder:text-gray-300 dark:text-gray-600  font-medium text-gray-900 dark:text-white "
                                placeholder="name@company.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 dark:text-gray-500  uppercase tracking-widest ml-1">Password</label>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800/50  border-none rounded-2xl focus:ring-4 focus:ring-indigo-100  focus:bg-white dark:bg-slate-800  transition-all duration-300 placeholder:text-gray-300 dark:text-gray-600  font-medium text-gray-900 dark:text-white "
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Security Captcha Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Security Captcha</label>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-gray-100/50 dark:border-slate-700/30">
                                <div 
                                    className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0"
                                    onClick={generateCaptcha}
                                    title="Click to Refresh Code"
                                >
                                    <canvas 
                                        ref={canvasRef} 
                                        width={140} 
                                        height={46} 
                                        className="block cursor-pointer"
                                    />
                                </div>
                                
                                <button 
                                    type="button" 
                                    onClick={generateCaptcha}
                                    className="p-3 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all active:scale-90 flex-shrink-0"
                                    title="Refresh Captcha"
                                >
                                    <RotateCw size={18} />
                                </button>

                                <input 
                                    type="text" 
                                    required 
                                    maxLength={6}
                                    value={captchaInput}
                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                    placeholder="Case Sensitive Code"
                                    className="flex-grow min-w-0 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:outline-none font-black text-center tracking-widest text-sm text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-100 dark:shadow-indigo-900/20  transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-gray-500 dark:text-gray-400  font-medium">
                        New here? <Link to="/register" className="text-indigo-600 dark:text-indigo-400  font-black hover:underline underline-offset-4">Create an account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

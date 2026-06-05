import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github as GithubIcon, Linkedin as LinkedinIcon, Twitter as TwitterIcon, Instagram as InstagramIcon, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-800  border-t border-gray-100 dark:border-slate-700  pt-24 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <FileText className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-black text-gray-900 dark:text-white  tracking-tight">Collab<span className="text-indigo-600 dark:text-indigo-400">Tool</span></span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400  font-medium leading-relaxed">
                            The ultimate real-time collaboration workspace for modern teams. Build faster, together.
                        </p>
                        <div className="flex gap-4">
                            {[TwitterIcon, GithubIcon, LinkedinIcon, InstagramIcon].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800/50  flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:bg-indigo-900/30  transition-all">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white  uppercase tracking-widest mb-8">Product</h4>
                        <ul className="space-y-4">
                            {['Features', 'Templates', 'Security', 'Pricing'].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-gray-500 dark:text-gray-400  font-medium hover:text-indigo-600 dark:text-indigo-400 transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white  uppercase tracking-widest mb-8">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Blog', 'Careers', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-gray-500 dark:text-gray-400  font-medium hover:text-indigo-600 dark:text-indigo-400 transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white  uppercase tracking-widest mb-8">Newsletter</h4>
                        <p className="text-gray-500 dark:text-gray-400  font-medium text-sm mb-6 leading-relaxed">
                            Get the latest updates on collaboration features and team productivity.
                        </p>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800/50  border-none rounded-xl focus:ring-2 focus:ring-indigo-100  text-sm font-bold placeholder:text-gray-400 dark:text-gray-500  transition-all"
                                />
                            </div>
                            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20  hover:bg-indigo-700 transition-all active:scale-95">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-gray-50 dark:border-slate-700/50  flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 dark:text-gray-500  text-sm font-medium">
                        © {new Date().getFullYear()} CollabTool Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-sm font-bold text-gray-400 dark:text-gray-500 ">
                        <Link to="#" className="hover:text-gray-900 dark:text-white  transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-gray-900 dark:text-white  transition-colors">Terms</Link>
                        <Link to="#" className="hover:text-gray-900 dark:text-white  transition-colors">Status</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

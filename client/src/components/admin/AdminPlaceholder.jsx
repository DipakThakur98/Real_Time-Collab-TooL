import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPlaceholder = ({ title, description, icon: Icon }) => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#15171e] border border-[#1e212b] p-12 rounded-3xl text-center max-w-2xl relative z-10 shadow-2xl overflow-hidden"
            >
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#11131a] to-[#1a1d27] border border-[#2a2e3d] rounded-2xl flex items-center justify-center mb-8 relative group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Icon size={48} className="text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-4 tracking-tight">
                    {title}
                </h1>
                
                <p className="text-[#8b949e] text-[15px] font-medium leading-relaxed mb-10 max-w-lg mx-auto">
                    {description}
                </p>

                <div className="bg-[#11131a] border border-[#1e212b] rounded-xl p-6 flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <Sparkles size={20} className="text-indigo-400" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-[13px] font-bold text-white mb-0.5 group-hover:text-indigo-400 transition-colors">Module Infrastructure Ready</h3>
                            <p className="text-[11px] text-[#8b949e]">The UI shell is operational. Backend logic deployment is pending.</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-[#8b949e] group-hover:text-white transition-colors group-hover:translate-x-1 duration-300" />
                </div>
            </motion.div>
        </div>
    );
};

export default AdminPlaceholder;

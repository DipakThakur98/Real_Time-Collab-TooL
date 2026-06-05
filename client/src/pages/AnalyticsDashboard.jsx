import React from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    ArrowUpRight, 
    ArrowDownRight,
    Globe,
    MousePointer2,
    Clock,
    Smartphone,
    Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsDashboard = () => {
    return (
        <div className="space-y-12">
            {/* Real-time pulse */}
            <header className="flex justify-between items-center bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        Audience Pulse <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Live traffic and engagement overview.</p>
                </div>
                <div className="flex gap-12">
                    <div className="text-right">
                        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Now</p>
                        <h4 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">124</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Page Views</p>
                        <h4 className="text-3xl font-black text-gray-900 dark:text-white">4,281</h4>
                    </div>
                </div>
            </header>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Avg. Session', value: '4m 12s', change: '+18%', up: true, icon: <Clock size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Bounce Rate', value: '32.4%', change: '-5%', up: true, icon: <MousePointer2 size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Social Traffic', value: '1,240', change: '+24%', up: true, icon: <Globe size={24} />, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((metric, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={metric.label}
                        className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 ${metric.bg} ${metric.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                                {metric.icon}
                            </div>
                            <span className={`flex items-center gap-1 text-sm font-black ${metric.up ? 'text-emerald-600' : 'text-red-500'}`}>
                                {metric.change} {metric.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            </span>
                        </div>
                        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{metric.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-2">{metric.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Detailed Charts (Simulated) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-xl font-black text-gray-900 dark:text-white">Traffic Source</h4>
                        <select className="bg-gray-50 dark:bg-slate-800/50 border-none rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="space-y-8">
                        {[
                            { name: 'Direct Traffic', value: 45, color: 'bg-indigo-600' },
                            { name: 'Organic Search', value: 30, color: 'bg-blue-500' },
                            { name: 'Social Media', value: 15, color: 'bg-purple-500' },
                            { name: 'Email Marketing', value: 10, color: 'bg-emerald-500' },
                        ].map(source => (
                            <div key={source.name} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-600">{source.name}</span>
                                    <span className="text-gray-900 dark:text-white">{source.value}%</span>
                                </div>
                                <div className="h-3 w-full bg-gray-50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${source.value}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`h-full ${source.color} rounded-full`}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-10">Device Distribution</h4>
                    <div className="grid grid-cols-2 gap-8 h-full">
                        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[2.5rem]">
                            <Monitor size={48} className="text-indigo-600 dark:text-indigo-400 mb-4" />
                            <h5 className="text-3xl font-black text-gray-900 dark:text-white">68%</h5>
                            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Desktop</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[2.5rem]">
                            <Smartphone size={48} className="text-purple-600 mb-4" />
                            <h5 className="text-3xl font-black text-gray-900 dark:text-white">32%</h5>
                            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Mobile</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Articles */}
            <section className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                <h4 className="text-xl font-black text-gray-900 dark:text-white mb-8">Top Performing Articles</h4>
                <div className="space-y-6">
                    {[
                        { title: 'The Future of AI in Real-time Collaboration', views: '12.4k', shares: '2.8k', trend: 'up' },
                        { title: 'Mastering WebSockets with Node.js', views: '8.2k', shares: '1.4k', trend: 'up' },
                        { title: 'Building Scalable SaaS Architectures', views: '6.1k', shares: '940', trend: 'down' },
                    ].map((article, i) => (
                        <div key={article.title} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800/50/50 rounded-3xl hover:bg-white dark:bg-slate-800 hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer group">
                            <div className="flex items-center gap-6">
                                <span className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-xs font-black text-gray-400 dark:text-gray-500 shadow-sm">{i + 1}</span>
                                <h5 className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">{article.title}</h5>
                            </div>
                            <div className="flex gap-12">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Views</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white">{article.views}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Shares</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white">{article.shares}</p>
                                </div>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${article.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                    {article.trend === 'up' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AnalyticsDashboard;

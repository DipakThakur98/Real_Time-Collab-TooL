import React, { useState } from 'react';
import { 
    Sparkles, 
    Wand2, 
    FileText, 
    Hash, 
    Search, 
    Globe, 
    ArrowRight,
    Loader2,
    CheckCircle2,
    Copy,
    Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const AIStudio = () => {
    const [activeTool, setActiveTool] = useState('blog'); // blog, captions, seo, hashtags
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState(null);
    const { showToast } = useToast();

    const tools = [
        { id: 'blog', label: 'Blog Generator', icon: <FileText size={20} />, description: 'Generate full technical blogs or tutorials.' },
        { id: 'captions', label: 'Social Captions', icon: <Wand2 size={20} />, description: 'Create engaging captions for all platforms.' },
        { id: 'seo', label: 'SEO Optimizer', icon: <Search size={20} />, description: 'Generate meta titles, desc and keywords.' },
        { id: 'hashtags', label: 'Hashtag Gen', icon: <Hash size={20} />, description: 'Get trending hashtags for your niche.' },
    ];

    const handleGenerate = async () => {
        if (!prompt) return showToast('Please enter a prompt', 'warning');
        setGenerating(true);
        setResult(null);

        try {
            // Simulated AI request
            await new Promise(r => setTimeout(r, 2000));
            
            if (activeTool === 'blog') {
                setResult({
                    title: `How to Build ${prompt} using CollabTool`,
                    content: `In this deep dive, we explore how ${prompt} can revolutionize your workflow...`,
                    seo: { title: `Mastering ${prompt} | CollabTool`, description: `Learn the secrets of ${prompt} with our comprehensive guide.` }
                });
            } else if (activeTool === 'captions') {
                setResult({
                    linkedin: `🚀 Revolutionize your ${prompt} workflow with #CollabTool!`,
                    twitter: `Level up your ${prompt} game today. 🔥 #Tech #AI`,
                    instagram: `Mastering ${prompt} like a pro. ✨`
                });
            } else if (activeTool === 'seo') {
                setResult({
                    metaTitle: `The Ultimate Guide to ${prompt}`,
                    metaDesc: `Discover how ${prompt} works and why it matters in 2024.`,
                    keywords: `${prompt}, AI, Collaboration, productivity`
                });
            } else {
                setResult({
                    hashtags: [`#${prompt.replace(/\s+/g, '')}`, '#AITools', '#FutureOfWork', '#Collaboration', '#SaaS']
                });
            }
            showToast('Content generated successfully!', 'success');
        } catch (error) {
            showToast('AI generation failed', 'error');
        } finally {
            setGenerating(false);
        }
    };

    const handlePublishDirectly = async () => {
        if (!result) return;
        setGenerating(true);
        try {
            const response = await api.post('/blogs', {
                title: result.title,
                content: result.content,
                excerpt: result.seo.description,
                category_id: 1,
                status: 'published',
                seo_title: result.seo.title,
                seo_description: result.seo.description
            });
            const { socialPosts } = response.data;
            if (socialPosts) {
                showToast(`✅ Blog published! ${socialPosts}`, 'success');
            } else {
                showToast('✅ Blog published! Connect social accounts to auto-share.', 'success');
            }
            setResult(null);
            setPrompt('');
        } catch (error) {
            const msg = error.response?.data?.error || error.message;
            showToast(`Failed to publish: ${msg}`, 'error');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                        AI Content Studio <Sparkles className="text-indigo-600 dark:text-indigo-400" />
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Generate premium production-ready content in seconds.</p>
                </div>
                <div className="flex gap-4 p-1.5 bg-gray-100 rounded-2xl">
                    {['blog', 'captions', 'seo', 'hashtags'].map(tool => (
                        <button 
                            key={tool}
                            onClick={() => { setActiveTool(tool); setResult(null); }}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                activeTool === tool ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
                            }`}
                        >
                            {tool}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Input Section */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                                {tools.find(t => t.id === activeTool).icon}
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-white">{tools.find(t => t.id === activeTool).label}</h4>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Tool</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Topic or Keywords</label>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={activeTool === 'blog' ? "e.g. Real-time collaboration in 2024" : "e.g. Technical blog about WebSockets"}
                                className="w-full h-40 p-6 bg-gray-50 dark:bg-slate-800/50 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-sm transition-all resize-none"
                            />
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {generating ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <><Wand2 size={20} /> Generate Content</>
                            )}
                        </button>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20">
                        <h4 className="font-black mb-4 flex items-center gap-2"><Globe size={18} /> Global Sync</h4>
                        <p className="text-indigo-100 text-xs font-medium leading-relaxed">
                            Every piece of content generated here can be instantly synced to your Content Hub and Social Dashboard.
                        </p>
                    </div>
                </div>

                {/* Result Section */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {!result && !generating ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full bg-gray-50 dark:bg-slate-800/50 border-2 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center"
                            >
                                <Sparkles size={64} className="text-gray-200 mb-6" />
                                <h3 className="text-xl font-black text-gray-300 dark:text-gray-600">Ready to Create?</h3>
                                <p className="text-gray-400 dark:text-gray-500 font-medium mt-2">Enter your prompt and watch the AI work its magic.</p>
                            </motion.div>
                        ) : generating ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[3rem] p-12 flex flex-col items-center justify-center space-y-8"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 rounded-full animate-spin"></div>
                                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 dark:text-indigo-400 animate-pulse" size={32} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">AI is crafting your {activeTool}...</h3>
                                    <p className="text-gray-400 dark:text-gray-500 font-medium mt-2">Analyzing trends and optimizing for engagement.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[3rem] p-12 shadow-sm space-y-8"
                            >
                                <div className="flex justify-between items-center pb-8 border-b border-gray-50 dark:border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Generation Complete</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-3 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:bg-indigo-900/30 rounded-xl transition-all"><Copy size={18} /></button>
                                        <button className="p-3 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:bg-indigo-900/30 rounded-xl transition-all"><Save size={18} /></button>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {activeTool === 'blog' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Generated Title</label>
                                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{result.title}</h2>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Content Snippet</label>
                                                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl">{result.content}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="bg-indigo-50 dark:bg-indigo-900/30/50 p-6 rounded-2xl">
                                                    <label className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 block">SEO Title</label>
                                                    <p className="text-sm font-bold text-indigo-900">{result.seo.title}</p>
                                                </div>
                                                <div className="bg-purple-50/50 p-6 rounded-2xl">
                                                    <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2 block">SEO Description</label>
                                                    <p className="text-sm font-bold text-purple-900">{result.seo.description}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {activeTool === 'captions' && (
                                        <div className="space-y-6">
                                            {Object.entries(result).map(([platform, text]) => (
                                                <div key={platform} className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-700">
                                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 block capitalize">{platform}</label>
                                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTool === 'hashtags' && (
                                        <div className="flex flex-wrap gap-3">
                                            {result.hashtags.map(tag => (
                                                <span key={tag} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-black transition-all hover:bg-indigo-600 hover:text-white cursor-pointer">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {activeTool === 'seo' && (
                                        <div className="space-y-6">
                                            <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Meta Title</label>
                                                <p className="font-bold text-gray-900 dark:text-white">{result.metaTitle}</p>
                                            </div>
                                            <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Meta Description</label>
                                                <p className="font-bold text-gray-900 dark:text-white">{result.metaDesc}</p>
                                            </div>
                                            <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Keywords</label>
                                                <p className="font-bold text-indigo-600 dark:text-indigo-400">{result.keywords}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handlePublishDirectly}
                                    disabled={generating}
                                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {generating ? <Loader2 className="animate-spin" /> : <>Publish Directly <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AIStudio;

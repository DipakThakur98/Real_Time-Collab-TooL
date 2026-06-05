import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
    Save, 
    X, 
    Image as ImageIcon, 
    Tag, 
    Search, 
    Sparkles,
    ChevronLeft,
    Globe,
    Settings,
    Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const BlogEditor = ({ onClose, onSave, initialData = null }) => {
    const [blog, setBlog] = useState(initialData || {
        title: '',
        content: '',
        excerpt: '',
        category_id: 1,
        status: 'draft',
        featured_image: '',
        seo_title: '',
        seo_description: ''
    });
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('editor'); // editor, seo, settings
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (initialData) {
            setBlog(initialData);
        }
    }, [initialData]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/blogs/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const handleSave = async () => {
        if (!blog.title || !blog.content) return showToast('Title and Content are required', 'warning');
        setSaving(true);
        try {
            if (initialData?.id) {
                // UPDATE existing blog
                const res = await api.put(`/blogs/${initialData.id}`, blog);
                const msg = res.data?.socialPosts 
                    ? `Blog updated! 🎉 ${res.data.socialPosts}` 
                    : 'Blog updated successfully!';
                showToast(msg, 'success');
            } else {
                // CREATE new blog
                const res = await api.post('/blogs', blog);
                const msg = res.data?.socialPosts 
                    ? `Blog created! 🎉 ${res.data.socialPosts}` 
                    : 'Blog created successfully!';
                showToast(msg, 'success');
            }
            onSave();
            onClose();
        } catch (error) {
            const errMsg = error.response?.data?.error || error.message;
            showToast(`Failed to save: ${errMsg}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'code-block'],
            ['clean']
        ],
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-6"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#f8fafc] w-full max-w-7xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <header className="px-10 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={onClose} className="p-3 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-2xl transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h3 className="text-xl font-black text-gray-900">{initialData ? 'Edit Article' : 'New Article'}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`w-2 h-2 rounded-full ${blog.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{blog.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 text-gray-500 font-bold text-sm hover:text-gray-900 transition-all">
                            <Eye size={18} /> Preview
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : <><Save size={18} /> Save Article</>}
                        </button>
                    </div>
                </header>

                <div className="flex flex-grow overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-8 gap-8">
                        {[
                            { id: 'editor', icon: <Edit3 size={22} /> },
                            { id: 'seo', icon: <Search size={22} /> },
                            { id: 'settings', icon: <Settings size={22} /> },
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`p-3.5 rounded-2xl transition-all ${
                                    activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                            >
                                {tab.icon}
                            </button>
                        ))}
                    </div>

                    {/* Main Workspace */}
                    <div className="flex-grow overflow-y-auto no-scrollbar p-12">
                        {activeTab === 'editor' && (
                            <div className="max-w-4xl mx-auto space-y-12">
                                <input 
                                    type="text"
                                    value={blog.title}
                                    onChange={(e) => setBlog({...blog, title: e.target.value})}
                                    placeholder="Enter your title here..."
                                    className="w-full text-5xl font-black text-gray-900 bg-transparent border-none outline-none placeholder:text-gray-200"
                                />
                                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                                    <ReactQuill 
                                        theme="snow"
                                        value={blog.content}
                                        onChange={(content) => setBlog({...blog, content})}
                                        modules={modules}
                                        className="h-full border-none"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'seo' && (
                            <div className="max-w-2xl mx-auto space-y-10">
                                <div>
                                    <h4 className="text-2xl font-black text-gray-900 mb-6">SEO Optimization</h4>
                                    <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
                                        <Sparkles className="text-indigo-600 mt-1" size={24} />
                                        <div>
                                            <p className="text-sm font-bold text-indigo-900">AI SEO Assistant</p>
                                            <p className="text-xs font-medium text-indigo-600 mt-1 leading-relaxed">Let AI generate optimized meta tags based on your content.</p>
                                            <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">Generate Now</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meta Title</label>
                                        <input 
                                            type="text"
                                            value={blog.seo_title}
                                            onChange={(e) => setBlog({...blog, seo_title: e.target.value})}
                                            className="w-full p-5 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meta Description</label>
                                        <textarea 
                                            value={blog.seo_description}
                                            onChange={(e) => setBlog({...blog, seo_description: e.target.value})}
                                            className="w-full h-32 p-5 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-700 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-2xl mx-auto space-y-10">
                                <h4 className="text-2xl font-black text-gray-900">Publication Settings</h4>
                                
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                                        <select 
                                            value={blog.category_id}
                                            onChange={(e) => setBlog({...blog, category_id: e.target.value})}
                                            className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-gray-700"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                                        <select 
                                            value={blog.status}
                                            onChange={(e) => setBlog({...blog, status: e.target.value})}
                                            className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-gray-700"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="scheduled">Scheduled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Featured Image URL</label>
                                    <input 
                                        type="text"
                                        value={blog.featured_image}
                                        onChange={(e) => setBlog({...blog, featured_image: e.target.value})}
                                        className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-gray-700"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Mocking Edit3 as it wasn't imported from lucide-react in the snippets above
import { Edit3 } from 'lucide-react';

export default BlogEditor;

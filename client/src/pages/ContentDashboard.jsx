import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Eye, 
    MessageSquare, 
    Share2, 
    Calendar,
    Filter,
    Edit3,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import BlogEditor from '../components/BlogEditor';

const ContentDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/blogs');
            setBlogs(response.data);
        } catch (error) {
            showToast('Failed to fetch blogs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setIsEditorOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        setDeletingId(id);
        try {
            await api.delete(`/blogs/${id}`);
            showToast('Article deleted successfully', 'success');
            fetchBlogs();
        } catch (error) {
            const msg = error.response?.data?.error || error.message;
            showToast(`Failed to delete: ${msg}`, 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const categories = ['All', 'Technical', 'Tutorial', 'Product', 'Social Media', 'AI News'];

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Articles', value: blogs.length, icon: <Edit3 className="text-blue-600" />, bg: 'bg-blue-50' },
                    { label: 'Total Views', value: blogs.reduce((acc, b) => acc + (b.views || 0), 0), icon: <Eye className="text-indigo-600 dark:text-indigo-400" />, bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
                    { label: 'Avg. Engagement', value: '12.4%', icon: <Share2 className="text-purple-600" />, bg: 'bg-purple-50' },
                    { label: 'New Subscribers', value: '+48', icon: <Plus className="text-emerald-600" />, bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm"
                    >
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                            {stat.icon}
                        </div>
                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-4 flex-grow w-full md:w-auto">
                    <div className="relative flex-grow md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-sm transition-all"
                        />
                    </div>
                    <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    selectedCategory === cat 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-gray-50 dark:bg-slate-800/50 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={() => { setEditingBlog(null); setIsEditorOpen(true); }}
                    className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 shrink-0"
                >
                    <Plus size={20} />
                    Create New Article
                </button>
            </div>

            {/* Content Table */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50 dark:border-slate-700/50">
                            <th className="px-8 py-6 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Article</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Category</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Stats</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-12 text-center text-gray-400 dark:text-gray-500 font-bold">Loading your content...</td>
                            </tr>
                        ) : blogs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-12 text-center text-gray-400 dark:text-gray-500 font-bold">No articles found. Start creating!</td>
                            </tr>
                        ) : (
                            blogs.map((blog) => (
                                <tr key={blog.id} className="group hover:bg-gray-50 dark:bg-slate-800/50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                                <img src={blog.featured_image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100'} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">{blog.title}</h4>
                                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-2">
                                                    <Calendar size={12} /> {new Date(blog.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            {blog.category_name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500">
                                                <Eye size={14} /> {blog.views || 0}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500">
                                                <MessageSquare size={14} /> 12
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            blog.status === 'published' 
                                            ? 'bg-emerald-50 text-emerald-600' 
                                            : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {blog.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                title="Edit Article"
                                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-all shadow-sm"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                disabled={deletingId === blog.id}
                                                title="Delete Article"
                                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-white dark:bg-slate-800 rounded-lg transition-all shadow-sm disabled:opacity-50"
                                            >
                                                {deletingId === blog.id
                                                    ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                                    : <Trash2 size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <AnimatePresence>
                {isEditorOpen && (
                    <BlogEditor 
                        onClose={() => setIsEditorOpen(false)} 
                        onSave={fetchBlogs}
                        initialData={editingBlog}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContentDashboard;

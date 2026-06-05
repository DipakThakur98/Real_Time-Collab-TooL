import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, X, Eye, LayoutTemplate, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category_id: '',
        status: 'draft',
        featured_image: '',
        seo_title: '',
        seo_description: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [blogsRes, catRes] = await Promise.all([
                api.get('/blogs'),
                api.get('/blogs/categories')
            ]);
            setBlogs(blogsRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error("Failed to fetch blogs data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (blog = null) => {
        if (blog) {
            setCurrentBlog(blog);
            setFormData({
                title: blog.title,
                excerpt: blog.excerpt,
                content: blog.content,
                category_id: blog.category_id,
                status: blog.status,
                featured_image: blog.featured_image || '',
                seo_title: blog.seo_title || '',
                seo_description: blog.seo_description || ''
            });
        } else {
            setCurrentBlog(null);
            setFormData({
                title: '', excerpt: '', content: '', category_id: categories.length > 0 ? categories[0].id : '',
                status: 'draft', featured_image: '', seo_title: '', seo_description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentBlog(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (currentBlog) {
                await api.put(`/blogs/${currentBlog.id}`, formData);
            } else {
                await api.post('/blogs', formData);
            }
            await fetchData();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save blog", error);
            alert("Error saving blog");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await api.delete(`/blogs/${id}`);
                setBlogs(blogs.filter(b => b.id !== id));
            } catch (error) {
                console.error("Failed to delete blog", error);
            }
        }
    };

    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        blog.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        if (status === 'published') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 relative">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Blog Management</h1>
                    <p className="text-sm text-indigo-200/80 mt-1 font-medium tracking-wide">Create, edit, and publish content to the public platform.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-sm font-bold text-gray-900 dark:text-white rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center gap-2 border border-white/10 hover:scale-105 transform"
                >
                    <Plus size={18} />
                    Create Blog
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="relative flex-grow group z-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 dark:text-white/40 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-all shadow-inner"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-900 dark:text-white font-bold hover:bg-white/10 transition-colors shadow-lg z-10">
                    <Filter size={16} />
                    Filters
                </button>
            </div>

            {/* Glass Data Table */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Blog Post</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Author</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Views</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-gray-900 dark:text-white/50">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                                        </div>
                                        Decrypting data streams...
                                    </td>
                                </tr>
                            ) : filteredBlogs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-gray-900 dark:text-white/50 font-medium">No blog posts found in the archives.</td>
                                </tr>
                            ) : (
                                filteredBlogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-white/[0.04] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1d27] to-[#11131a] flex items-center justify-center text-gray-900 dark:text-white border border-white/10 shadow-inner flex-shrink-0">
                                                    {blog.featured_image ? (
                                                        <img src={blog.featured_image} alt="" className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                                                    ) : (
                                                        <LayoutTemplate size={18} className="text-indigo-400/50" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-300 transition-colors line-clamp-1">{blog.title}</p>
                                                    <div className="flex items-center gap-1 text-[11px] font-medium text-gray-900 dark:text-white/40 mt-1">
                                                        <LinkIcon size={10} /> {blog.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[12px] font-medium text-gray-900 dark:text-white/60 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                                                {blog.category_name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-900 dark:text-white/60 font-bold">
                                            {blog.author_name}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(blog.status)}`}>
                                                {blog.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-900 dark:text-white/60 text-sm font-bold">
                                                <Eye size={14} className="text-indigo-400/50" />
                                                {blog.views.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenModal(blog)} title="Edit" className="p-2 text-gray-900 dark:text-white/40 hover:text-indigo-400 hover:bg-indigo-400/20 rounded-xl transition-colors border border-transparent hover:border-indigo-400/30">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(blog.id)} title="Delete" className="p-2 text-gray-900 dark:text-white/40 hover:text-rose-400 hover:bg-rose-400/20 rounded-xl transition-colors border border-transparent hover:border-rose-400/30">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="bg-gray-50 dark:bg-[#11131a] border border-gray-200 dark:border-[#1e212b] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
                        <div className="sticky top-0 bg-gray-50 dark:bg-[#11131a]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#1e212b] px-8 py-5 flex items-center justify-between z-20">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {currentBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 text-gray-500 dark:text-[#8b949e] hover:text-gray-900 dark:text-white hover:bg-white/10 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">Title</label>
                                        <input 
                                            type="text" required
                                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                            className="w-full px-4 py-3 bg-white dark:bg-[#15171e] border border-gray-200 dark:border-[#1e212b] rounded-xl text-gray-900 dark:text-white placeholder-[#8b949e] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
                                            placeholder="Enter blog title..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">Excerpt</label>
                                        <textarea 
                                            rows="2"
                                            value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})}
                                            className="w-full px-4 py-3 bg-white dark:bg-[#15171e] border border-gray-200 dark:border-[#1e212b] rounded-xl text-gray-900 dark:text-white placeholder-[#8b949e] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
                                            placeholder="Short summary for preview cards..."
                                        ></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">Content</label>
                                        <textarea 
                                            required rows="12"
                                            value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                                            className="w-full px-4 py-3 bg-white dark:bg-[#15171e] border border-gray-200 dark:border-[#1e212b] rounded-xl text-gray-900 dark:text-white placeholder-[#8b949e] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y font-mono text-sm leading-relaxed"
                                            placeholder="Write your markdown or text content here..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">Status</label>
                                        <select 
                                            value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                                            className="w-full px-4 py-3 bg-white dark:bg-[#15171e] border border-gray-200 dark:border-[#1e212b] rounded-xl text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">Category</label>
                                        <select 
                                            value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}
                                            className="w-full px-4 py-3 bg-white dark:bg-[#15171e] border border-gray-200 dark:border-[#1e212b] rounded-xl text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Category...</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">Featured Image URL</label>
                                        <div className="relative">
                                            <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#8b949e]" />
                                            <input 
                                                type="text"
                                                value={formData.featured_image} onChange={e => setFormData({...formData, featured_image: e.target.value})}
                                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#15171e] border border-gray-200 dark:border-[#1e212b] rounded-xl text-gray-900 dark:text-white placeholder-[#8b949e] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white dark:bg-[#15171e] border border-gray-200 dark:border-[#1e212b] rounded-xl space-y-4">
                                        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">SEO Meta Data</h3>
                                        <div className="space-y-2">
                                            <input 
                                                type="text"
                                                value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#11131a] border border-gray-200 dark:border-[#1e212b] rounded-lg text-gray-900 dark:text-white placeholder-[#8b949e] focus:border-indigo-500 outline-none text-xs"
                                                placeholder="SEO Title..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <textarea 
                                                rows="3"
                                                value={formData.seo_description} onChange={e => setFormData({...formData, seo_description: e.target.value})}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#11131a] border border-gray-200 dark:border-[#1e212b] rounded-lg text-gray-900 dark:text-white placeholder-[#8b949e] focus:border-indigo-500 outline-none resize-none text-xs"
                                                placeholder="SEO Meta Description..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-[#1e212b]">
                                <button 
                                    type="button" 
                                    onClick={handleCloseModal}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-900 dark:text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm font-bold text-gray-900 dark:text-white rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save & Publish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogs;

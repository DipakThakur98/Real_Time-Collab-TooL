import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import api from '../services/api';

const Blog = () => {
    const [posts, setPosts] = React.useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', excerpt: '', image: '', content: '' });
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('All');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost(prev => ({ ...prev, [name]: value }));
    };

    const submitPost = async () => {
        if (!newPost.title.trim()) {
            return;
        }
        try {
            await api.post('/blogs', { ...newPost, category: 'Technical' });
            setShowModal(false);
            setNewPost({ title: '', excerpt: '', image: '', content: '' });
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory, searchTerm]);

    const fetchPosts = async () => {
        try {
            const response = await api.get('/blogs', {
                params: {
                    category: selectedCategory === 'All' ? undefined : selectedCategory.toLowerCase(),
                    search: searchTerm || undefined,
                    status: 'published'
                }
            });
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Technical', 'Tutorial', 'Social Media', 'Product', 'AI News'];

    const filteredPosts = posts.filter(post => {
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-[#f8fafc] dark:bg-slate-900  min-h-screen transition-colors duration-300">
            <Navbar />
            
            <main className="pt-40 pb-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Header */}

                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-2xl shadow-lg">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">New Blog Post</h2>
                                <input name="title" placeholder="Title" value={newPost.title} onChange={handleInputChange} className="w-full mb-2 p-2 border rounded" />
                                <input name="excerpt" placeholder="Excerpt" value={newPost.excerpt} onChange={handleInputChange} className="w-full mb-2 p-2 border rounded" />
                                <input name="image" placeholder="Image URL" value={newPost.image} onChange={handleInputChange} className="w-full mb-2 p-2 border rounded" />
                                <textarea name="content" placeholder="Content" value={newPost.content} onChange={handleInputChange} className="w-full mb-4 p-2 border rounded h-32" />
                                <div className="flex justify-end space-x-4">
                                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-slate-700 rounded">Cancel</button>
                                    <button onClick={submitPost} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Publish</button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Featured Post */}
                    {posts.length > 0 && selectedCategory === 'All' && (
                        <div className="mb-24 group relative bg-white dark:bg-slate-800 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-slate-700 shadow-lg flex flex-col lg:flex-row">
                            <div className="lg:w-1/2 overflow-hidden">
                                <img 
                                    src={posts[0].image} 
                                    alt="Featured" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center space-y-6">
                                <span className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30  text-indigo-600 dark:text-indigo-400  rounded-full text-xs font-black uppercase tracking-widest">Latest Insight</span>
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white  leading-tight">{posts[0].title}</h2>
                                <p className="text-lg text-gray-500 dark:text-gray-400  font-medium leading-relaxed">
                                    {posts[0].subtitle || posts[0].excerpt}
                                </p>
                                <Link to={`/blog/${posts[0].id}`} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400  font-bold text-lg group/btn">
                                    Read Full Article <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Secondary Featured Post */}
                    {posts.length > 1 && selectedCategory === 'All' && (
                      <div className="mb-24 group relative bg-white dark:bg-slate-800 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-slate-700 shadow-lg flex flex-col-reverse lg:flex-row">
                        <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center space-y-6">
                          <span className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest">
                            {posts[1].category}
                          </span>
                          <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">
                            {posts[1].title}
                          </h2>
                          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            {posts[1].subtitle || posts[1].excerpt}
                          </p>
                          <Link to={`/blog/${posts[1].id}`} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg group/btn">
                            Read Full Article <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                          </Link>
                        </div>
                        <div className="lg:w-1/2 overflow-hidden">
                          <img src={posts[1].image || 'https://picsum.photos/seed/featured2/800/400'} alt="Featured" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      </div>
                    )}
                    {/* Search & Categories */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 px-4">
                        <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
                            {categories.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 ' : 'bg-white dark:bg-slate-800  text-gray-500 dark:text-gray-400  hover:bg-indigo-50 dark:bg-indigo-900/30  hover:text-indigo-600 dark:text-indigo-400  border border-gray-100 dark:border-slate-700 '}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search articles..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-3 bg-white dark:bg-slate-800  border border-gray-100 dark:border-slate-700  rounded-2xl focus:ring-2 focus:ring-indigo-100  focus:outline-none font-medium shadow-sm "
                            />
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredPosts.map((post) => (
                            <motion.article 
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="bg-white dark:bg-slate-800  rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-slate-700  shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
                            >
                                <div className="h-64 overflow-hidden relative"
                                 style={{ position: 'relative' }}>
                                    <img 
                                        src={post.image || 'https://picsum.photos/seed/blogfallback/400/300'} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className="px-4 py-1.5 bg-white dark:bg-slate-800/90  backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white  shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-10 space-y-6 flex-grow flex flex-col">
                                    <div className="flex items-center gap-6 text-xs font-bold text-gray-400 dark:text-gray-500  uppercase tracking-widest">
                                        <span className="flex items-center gap-2"><Calendar size={14} /> {post.date}</span>
                                        <span className="flex items-center gap-2"><User size={14} /> {post.author}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white  leading-tight group-hover:text-indigo-600 dark:text-indigo-400  transition-colors">
                                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400  font-medium leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-6 border-t border-gray-50 dark:border-slate-700/50  mt-auto">
                                        <Link to={`/blog/${post.id}`} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400  font-bold group/link">
                                            Read More <ArrowRight className="group-hover/link:translate-x-1 transition-transform" size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="mt-24 flex justify-center gap-4">
                        <button className="w-14 h-14 bg-white dark:bg-slate-800  border border-gray-100 dark:border-slate-700  rounded-2xl flex items-center justify-center font-bold text-gray-400 dark:text-gray-500  hover:text-indigo-600 dark:text-indigo-400  hover:border-indigo-600  transition-all">1</button>
                        <button className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 ">2</button>
                        <button className="w-14 h-14 bg-white dark:bg-slate-800  border border-gray-100 dark:border-slate-700  rounded-2xl flex items-center justify-center font-bold text-gray-400 dark:text-gray-500  hover:text-indigo-600 dark:text-indigo-400  hover:border-indigo-600  transition-all">3</button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;

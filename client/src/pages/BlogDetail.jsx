import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, MessageSquare, Heart, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import api from '../services/api';

const BlogDetail = () => {
    const { id } = useParams(); // Using id as slug
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await api.get(`/blogs/${id}`);
            setPost(response.data);
        } catch (error) {
            console.error('Failed to fetch post');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center ">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800  min-h-screen transition-colors duration-300">
            <Navbar />
            
            <main className="pt-32 pb-32">
                {/* Post Hero */}
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <button 
                        onClick={() => navigate('/blog')}
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400  font-bold hover:text-indigo-600 dark:text-indigo-400 mb-12 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
                    </button>

                    <div className="space-y-8 mb-16">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30  text-indigo-600 dark:text-indigo-400  rounded-full text-xs font-black uppercase tracking-widest"
                        >
                            {post.category}
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white  tracking-tight leading-tight"
                        >
                            {post.title}
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-gray-500 dark:text-gray-400  font-medium"
                        >
                            {post.subtitle}
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center gap-8 pt-4 border-t border-gray-100 dark:border-slate-700 "
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200  overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${post.author}`} alt={post.author} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white ">{post.author}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Author</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm font-bold text-gray-400 dark:text-gray-500 ">
                                <span className="flex items-center gap-2 uppercase tracking-widest"><Calendar size={16} /> {post.date}</span>
                                <span className="flex items-center gap-2 uppercase tracking-widest"><Clock size={16} /> {post.readTime}</span>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-[3rem] overflow-hidden shadow-2xl mb-20 aspect-video"
                    >
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </motion.div>

                    {/* Content */}
                    <div className="max-w-3xl mx-auto">
                        <div 
                            className="prose prose-lg  prose-indigo max-w-none 
                            prose-headings:font-black prose-headings:tracking-tight 
                            prose-p:text-gray-600  prose-p:leading-relaxed
                            prose-blockquote:border-indigo-600 prose-blockquote:bg-indigo-50 dark:bg-indigo-900/30  
                            prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-2xl prose-blockquote:not-italic"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Actions */}
                        <div className="mt-20 pt-12 border-t border-gray-100 dark:border-slate-700  flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-slate-800/50  rounded-xl font-bold text-gray-600  hover:bg-indigo-50 dark:bg-indigo-900/30  hover:text-indigo-600 dark:text-indigo-400 transition-all">
                                    <Heart size={20} /> Like
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-slate-800/50  rounded-xl font-bold text-gray-600  hover:bg-indigo-50 dark:bg-indigo-900/30  hover:text-indigo-600 dark:text-indigo-400 transition-all">
                                    <Share2 size={20} /> Share
                                </button>
                            </div>
                            <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold hover:text-indigo-600 dark:text-indigo-400">
                                <MessageSquare size={20} /> 12 Comments
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetail;

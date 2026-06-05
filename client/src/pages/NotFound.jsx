import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-800  flex items-center justify-center p-6 transition-colors duration-300">
            <Navbar />
            
            <div className="max-w-3xl w-full text-center space-y-12">
                <div className="relative">
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[12rem] md:text-[20rem] font-black text-indigo-600 dark:text-indigo-400/10  select-none"
                    >
                        404
                    </motion.h1>
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white  tracking-tight">Lost in Space?</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400  font-medium max-w-md mx-auto">
                            The document you're looking for has moved to another dimension or never existed.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                    <Link 
                        to="/" 
                        className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20  hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                    <button 
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-800  text-gray-600  border border-gray-100 dark:border-slate-700  rounded-2xl font-black text-lg shadow-sm hover:bg-gray-50 dark:bg-slate-800/50  transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

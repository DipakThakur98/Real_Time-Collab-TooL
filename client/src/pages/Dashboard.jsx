import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, FileText, Trash2 } from 'lucide-react';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, alphabetical
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents', error);
        } finally {
            setLoading(false);
        }
    };

    const createDocument = async () => {
        try {
            const response = await api.post('/documents');
            navigate(`/document/${response.data.id}`);
        } catch (error) {
            showToast('Error creating document', 'error');
        }
    };

    const deleteDocument = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await api.delete(`/documents/${id}`);
                setDocuments(documents.filter(doc => doc.id !== id));
                showToast('Document deleted successfully');
            } catch (error) {
                showToast('Error deleting document', 'error');
            }
        }
    };

    const filteredDocuments = documents
        .filter(doc => (doc.title || 'Untitled Document').toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'alphabetical') return (a.title || 'Untitled').localeCompare(b.title || 'Untitled');
            if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

    return (
        <div className="bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300">

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div className="flex-grow">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white  tracking-tight">Your Documents</h1>
                        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400  font-medium">Create, edit, and collaborate in real-time.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                            <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 rotate-45" size={18} />
                            <input 
                                type="text"
                                placeholder="Search documents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800  border border-gray-100 dark:border-slate-700  rounded-2xl focus:ring-2 focus:ring-indigo-100  focus:outline-none font-medium shadow-sm  transition-all"
                            />
                        </div>

                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 bg-white dark:bg-slate-800  border border-gray-100 dark:border-slate-700  rounded-2xl focus:ring-2 focus:ring-indigo-100  focus:outline-none font-bold text-gray-500 dark:text-gray-400  shadow-sm cursor-pointer transition-all"
                        >
                            <option value="newest">Last Updated</option>
                            <option value="oldest">Oldest First</option>
                            <option value="alphabetical">A - Z</option>
                        </select>

                        <button 
                            onClick={createDocument}
                            className="group flex items-center justify-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20  active:scale-95"
                        >
                            <Plus className="group-hover:rotate-90 transition-transform duration-300" size={24} />
                            <span className="text-lg font-bold">New Project</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading your workspace...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredDocuments.map(doc => (
                            <div 
                                key={doc.id}
                                onClick={() => navigate(`/document/${doc.id}`)}
                                className="group bg-white dark:bg-slate-800  p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700  shadow-sm hover:shadow-2xl hover:shadow-indigo-100 dark:shadow-indigo-900/20  transition-all duration-500 cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <button 
                                        onClick={(e) => deleteDocument(doc.id, e)}
                                        className="p-2 text-gray-300 dark:text-gray-600  hover:text-red-600 hover:bg-red-50  rounded-xl transition-colors duration-200"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                
                                <div className="mb-6 w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30  text-indigo-600 dark:text-indigo-400  rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 ring-8 ring-indigo-50/50 ">
                                    <FileText size={32} />
                                </div>
 
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white  group-hover:text-indigo-600 dark:text-indigo-400  transition-colors duration-300 truncate pr-8">
                                        {doc.title || 'Untitled Document'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 ">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                        <p className="text-xs font-semibold uppercase tracking-wider">
                                            Updated {new Date(doc.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
 
                                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-700/50  flex items-center justify-between">
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400  uppercase tracking-widest">Open Editor</span>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800/50  flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                        <Plus className="rotate-45 text-gray-400 dark:text-gray-500 " size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredDocuments.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-800  rounded-[3rem] border-4 border-dashed border-gray-50 dark:border-slate-700/50  transition-colors duration-300">
                                <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800/50  rounded-full flex items-center justify-center mb-6">
                                    <FileText size={48} className="text-gray-200 " />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-400 dark:text-gray-500 ">
                                    {searchTerm ? 'No matching documents found' : 'Your workspace is empty'}
                                </h2>
                                <p className="text-gray-400 dark:text-gray-500  mt-2">
                                    {searchTerm ? 'Try a different search term or clear the input.' : 'Click "New Project" to start collaborating.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

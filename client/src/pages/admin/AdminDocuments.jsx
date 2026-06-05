import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, FileText, Share2 } from 'lucide-react';
import api from '../../services/api';

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error("Failed to fetch documents", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document permanently?')) {
            try {
                await api.delete(`/documents/${id}`);
                setDocuments(documents.filter(doc => doc.id !== id));
            } catch (error) {
                console.error("Failed to delete document", error);
                alert("Failed to delete. You must be the owner.");
            }
        }
    };

    const filteredDocs = documents.filter(doc => 
        doc.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Documents Hub</h1>
                    <p className="text-sm text-indigo-200/80 mt-1 font-medium tracking-wide">Manage platform documents and collaborative sessions.</p>
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="relative flex-grow group z-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 dark:text-white/40 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search documents by ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-all shadow-inner"
                    />
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Document ID</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest">Owner ID</th>
                                <th className="px-6 py-5 text-[11px] font-black text-gray-900 dark:text-white/40 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-16 text-center text-gray-900 dark:text-white/50">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
                                        </div>
                                        Decrypting data streams...
                                    </td>
                                </tr>
                            ) : filteredDocs.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-16 text-center text-gray-900 dark:text-white/50 font-medium">No documents found.</td>
                                </tr>
                            ) : (
                                filteredDocs.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-white/[0.04] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
                                                    <FileText size={18} />
                                                </div>
                                                <p className="text-sm font-mono text-gray-900 dark:text-white/80">{doc.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-900 dark:text-white/60 font-mono">
                                            {doc.owner_id}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button onClick={() => handleDelete(doc.id)} title="Delete" className="p-2 text-gray-900 dark:text-white/40 hover:text-rose-400 hover:bg-rose-400/20 rounded-xl transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDocuments;

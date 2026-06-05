import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { initiateSocketConnection, getSocket, disconnectSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Users, ChevronLeft, Save, Loader2, MessageSquare, Share2, Check, HelpCircle, Command, Plus, Sparkles } from 'lucide-react';
import api from '../services/api';
import ChatSidebar from '../components/ChatSidebar';
import AiSidebar from '../components/AiSidebar';

const SAVE_INTERVAL_MS = 2000;

const DocumentEditor = () => {
    const { id: documentId } = useParams();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [title, setTitle] = useState('Loading...');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({ words: 0, chars: 0, scroll: 0 });
    const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
    
    const quillRef = useRef(null);
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Initial setup
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        socketRef.current = initiateSocketConnection(token);

        fetchDocument();

        return () => {
            disconnectSocket();
        };
    }, [documentId]);

    const fetchDocument = async () => {
        try {
            const response = await api.get(`/documents/${documentId}`);
            setTitle(response.data.title);
        } catch (err) {
            console.error('Error fetching doc metadata', err);
            navigate('/');
        }
    };

    // Socket listeners
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.emit('join-document', documentId);

        socket.on('load-document', (content) => {
            const quill = quillRef.current.getEditor();
            quill.setContents(content);
            quill.enable();
            updateStats();
        });

        socket.on('receive-changes', (delta) => {
            quillRef.current.getEditor().updateContents(delta);
        });

        socket.on('user-list', (users) => {
            setOnlineUsers(users);
        });

        socket.on('user-typing', (username) => {
            setTypingUser(username);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000);
        });

        return () => {
            socket.off('load-document');
            socket.off('receive-changes');
            socket.off('user-list');
            socket.off('user-typing');
        };
    }, [documentId]);

    const updateStats = useCallback(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        const text = quill.getText().trim();
        const words = text ? text.split(/\s+/).length : 0;
        const chars = text.length;
        
        // Calculate scroll percentage
        const editor = document.querySelector('.ql-editor');
        if (editor) {
            const scroll = (editor.scrollTop / (editor.scrollHeight - editor.clientHeight)) * 100;
            setStats(prev => ({ ...prev, words, chars, scroll: isNaN(scroll) ? 0 : scroll }));
        }
    }, []);

    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const handleSelectionChange = (range) => {
            if (range) {
                const textBefore = quill.getText(0, range.index);
                const lines = textBefore.split('\n');
                setCursorPos({
                    line: lines.length,
                    col: lines[lines.length - 1].length + 1
                });
            }
        };

        quill.on('selection-change', handleSelectionChange);
        return () => quill.off('selection-change', handleSelectionChange);
    }, []);

    // Handle editor changes
    const handleChange = (content, delta, source) => {
        if (source !== 'user') return;
        
        socketRef.current.emit('send-changes', delta, documentId);
        socketRef.current.emit('typing', documentId);
        updateStats();
    };

    // Auto-save logic
    useEffect(() => {
        const interval = setInterval(() => {
            const quill = quillRef.current?.getEditor();
            if (!quill) return;

            const contents = quill.getContents();
            setIsSaving(true);
            socketRef.current.emit('save-document', contents, documentId);
            setTimeout(() => setIsSaving(false), 500);
        }, SAVE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [documentId]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        showToast('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const exportToMarkdown = () => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        const text = quill.getText();
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'document'}.md`;
        a.click();
        setIsDownloadOpen(false);
        showToast('Exported as Markdown');
    };

    const exportToPDF = () => {
        showToast('Opening print dialog...', 'info');
        window.print();
        setIsDownloadOpen(false);
    };

    return (
        <div className="flex flex-col h-screen bg-[#f1f5f9]  transition-colors duration-300">
            {/* Toolbar / Header */}
            <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-6 py-4 bg-white dark:bg-slate-800/80  backdrop-blur-md border-b border-gray-200  sticky top-0 z-30 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100  text-gray-500 dark:text-gray-400  hover:text-indigo-600 dark:text-indigo-400 rounded-xl transition-all duration-200 group"
                    >
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={24} />
                    </button>
                    <div className="flex-grow">
                        <div className="flex items-center gap-3">
                            <input 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-xl font-black text-gray-900 dark:text-white  focus:outline-none border-b-2 border-transparent focus:border-indigo-500 bg-transparent min-w-[150px] transition-colors"
                                placeholder="Untitled Document"
                            />
                            {isSaving && <Loader2 size={16} className="text-indigo-400 animate-spin" />}
                        </div>
                        <div className="flex items-center gap-4 h-4 mt-1">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em]">
                                <span className="text-gray-400 dark:text-gray-500 ">{stats.words} Words</span>
                                <span className="text-gray-400 dark:text-gray-500 ">{stats.chars} Chars</span>
                            </div>
                            {typingUser ? (
                                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest animate-pulse">
                                    {typingUser} is typing...
                                </p>
                            ) : (
                                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <Check size={10} /> Saved
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4">
                    {/* Online Users List */}
                    <div className="hidden sm:flex items-center bg-gray-50 dark:bg-slate-800/50  px-3 py-1.5 rounded-xl border border-gray-100 dark:border-slate-700  gap-2">
                        <div className="flex -space-x-2">
                            {onlineUsers.slice(0, 3).map((u, i) => (
                                <div 
                                    key={i}
                                    title={u}
                                    className="h-8 w-8 rounded-lg ring-2 ring-white  bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm"
                                >
                                    {u[0].toUpperCase()}
                                </div>
                            ))}
                            {onlineUsers.length > 3 && (
                                <div className="h-8 w-8 rounded-lg ring-2 ring-white  bg-gray-200  flex items-center justify-center text-gray-500 dark:text-gray-400  text-[10px] font-black">
                                    +{onlineUsers.length - 3}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Download Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                                className={`p-3 rounded-xl transition-all duration-300 border ${isDownloadOpen ? 'bg-indigo-50 dark:bg-indigo-900/30  border-indigo-200  text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-slate-800  border-gray-200  text-gray-500 dark:text-gray-400  hover:border-indigo-600'}`}
                            >
                                <Save size={20} />
                            </button>
                            
                            <AnimatePresence>
                                {isDownloadOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsDownloadOpen(false)}></div>
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800  rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700  p-2 z-50"
                                        >
                                            <button onClick={exportToMarkdown} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:bg-indigo-900/30  rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300  transition-colors">
                                                Download as MD
                                            </button>
                                            <button onClick={exportToPDF} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:bg-indigo-900/30  rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300  transition-colors">
                                                Print as PDF
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button 
                            onClick={handleShare}
                            className={`p-3 rounded-xl transition-all duration-300 border ${copied ? 'bg-green-50  border-green-200  text-green-600' : 'bg-white dark:bg-slate-800  border-gray-200  text-gray-500 dark:text-gray-400  hover:border-indigo-600'}`}
                        >
                            {copied ? <Check size={20} /> : <Share2 size={20} />}
                        </button>

                        <button 
                            onClick={() => setIsHelpOpen(true)}
                            className="p-3 rounded-xl bg-white dark:bg-slate-800  border border-gray-200  text-gray-500 dark:text-gray-400  hover:border-indigo-600 transition-all"
                        >
                            <HelpCircle size={20} />
                        </button>

                        <button 
                            onClick={() => { setIsChatOpen(!isChatOpen); setIsAiOpen(false); }}
                            className={`relative p-3 rounded-xl transition-all duration-300 border ${isChatOpen ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 ' : 'bg-white dark:bg-slate-800  border-gray-200  text-gray-500 dark:text-gray-400  hover:border-indigo-600'}`}
                            title="Collaborative Chat"
                        >
                            <MessageSquare size={20} />
                            {onlineUsers.length > 1 && !isChatOpen && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white  rounded-full"></span>
                            )}
                        </button>

                        <button 
                            onClick={() => { setIsAiOpen(!isAiOpen); setIsChatOpen(false); }}
                            className={`p-3 rounded-xl transition-all duration-300 border ${isAiOpen ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 ' : 'bg-white dark:bg-slate-800  border-gray-200  text-gray-500 dark:text-gray-400  hover:border-indigo-600'}`}
                            title="AI Co-Writer Panel"
                        >
                            <Sparkles size={20} />
                        </button>
                    </div>
                </div>
                {/* Scroll Progress Bar */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-indigo-600 transition-all duration-300" style={{ width: `${stats.scroll}%` }}></div>
            </header>

            <div className="flex flex-grow overflow-hidden relative">
                {/* Editor Container */}
                <div 
                    className={`flex-grow flex flex-col items-center py-6 md:py-12 px-4 transition-all duration-500 overflow-y-auto ${(isChatOpen || isAiOpen) ? 'lg:mr-[360px]' : ''}`}
                    onScroll={updateStats}
                >
                    <div className="w-full max-w-4xl bg-white dark:bg-slate-800  shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20/50  rounded-[2rem] md:rounded-[2.5rem] border border-white  overflow-hidden flex flex-col min-h-[calc(100vh-250px)] md:min-h-[1100px]">
                        <ReactQuill 
                            ref={quillRef}
                            theme="snow"
                            onChange={handleChange}
                            className="flex-grow flex flex-col "
                            placeholder="Start writing something brilliant..."
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'color': [] }, { 'background': [] }],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['link', 'image', 'code-block'],
                                    ['clean']
                                ],
                            }}
                        />
                    </div>
                    
                    {/* Status Bar */}
                    <div className="w-full max-w-4xl mt-6 px-8 py-3 bg-white dark:bg-slate-800  border border-gray-100 dark:border-slate-700  rounded-2xl flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500  shadow-sm">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/300"></span>
                                Ln {cursorPos.line}, Col {cursorPos.col}
                            </span>
                            <span>{Math.round(stats.scroll)}% Scrolled</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>UTF-8</span>
                            <span>Markdown Supported</span>
                        </div>
                    </div>
                </div>

                {/* Floating Chat Sidebar */}
                <div className={`fixed top-0 md:top-24 bottom-0 md:bottom-6 right-0 md:right-6 w-full md:w-[360px] transition-all duration-500 transform ${isChatOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'} z-50`}>
                    <div className="h-full bg-white dark:bg-slate-800  md:rounded-[2.5rem] shadow-2xl shadow-indigo-500/20  border-l md:border border-gray-100 dark:border-slate-700  overflow-hidden flex flex-col">
                        <ChatSidebar 
                            documentId={documentId}
                            socket={socketRef.current}
                            isOpen={isChatOpen}
                            onClose={() => setIsChatOpen(false)}
                            user={user}
                        />
                    </div>
                </div>

                {/* Floating AI Sidebar */}
                <div className={`fixed top-0 md:top-24 bottom-0 md:bottom-6 right-0 md:right-6 w-full md:w-[360px] transition-all duration-500 transform ${isAiOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'} z-50`}>
                    <div className="h-full bg-white dark:bg-slate-800  md:rounded-[2.5rem] shadow-2xl shadow-indigo-500/20  border-l md:border border-gray-100 dark:border-slate-700  overflow-hidden flex flex-col">
                        <AiSidebar 
                            isOpen={isAiOpen}
                            onClose={() => setIsAiOpen(false)}
                            quillRef={quillRef}
                        />
                    </div>
                </div>
            </div>

            {/* Help Modal */}
            <AnimatePresence>
                {isHelpOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsHelpOpen(false)}
                            className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-800  rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-700  p-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <button onClick={() => setIsHelpOpen(false)} className="p-2 hover:bg-gray-100  rounded-xl transition-colors">
                                    <Plus className="rotate-45 text-gray-400 dark:text-gray-500" size={24} />
                                </button>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                                    <Command size={32} />
                                    <h3 className="text-2xl font-black tracking-tight ">Keyboard Shortcuts</h3>
                                </div>
                                
                                <div className="space-y-4">
                                    {[
                                        { key: 'Ctrl + S', desc: 'Saves document manually' },
                                        { key: 'Ctrl + P', desc: 'Print / Export as PDF' },
                                        { key: 'Ctrl + B', desc: 'Bold text' },
                                        { key: 'Ctrl + I', desc: 'Italic text' },
                                        { key: 'Ctrl + K', desc: 'Insert Link' },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-700/50 ">
                                            <span className="text-gray-500 dark:text-gray-400  font-bold">{s.desc}</span>
                                            <span className="px-3 py-1 bg-gray-100  rounded-lg text-xs font-black text-gray-900 dark:text-white  tracking-widest">{s.key}</span>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-center italic">
                                    More features coming soon in CollabTool v2.1
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DocumentEditor;

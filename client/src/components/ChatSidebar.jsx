import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import api from '../services/api';

const ChatSidebar = ({ documentId, socket, isOpen, onClose, user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
        }
    }, [isOpen, documentId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive-message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socket.off('receive-message');
    }, [socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/messages/${documentId}`);
            setMessages(response.data);
        } catch (err) {
            console.error('Error fetching messages', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = { content: newMessage };
        
        try {
            // Persist to DB
            await api.post('/messages', { documentId, ...messageData });
            
            // Broadcast via Socket
            const messageWithUser = {
                ...messageData,
                username: user.username,
                sender_id: user.id,
                created_at: new Date()
            };
            socket.emit('send-message', messageWithUser, documentId);
            
            // Update local state
            setMessages((prev) => [...prev, messageWithUser]);
            setNewMessage('');
        } catch (err) {
            alert('Failed to send message');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="w-80 h-full bg-white  border-l border-gray-100  shadow-xl flex flex-col z-20 transition-colors duration-300">
            <div className="p-4 border-b border-gray-100  flex justify-between items-center bg-gray-50 ">
                <div className="flex items-center gap-2 font-bold text-gray-700 ">
                    <MessageSquare size={20} />
                    Document Chat
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-200  rounded-full transition text-gray-400">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender_id === user.id ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] font-black text-gray-400  mb-1 uppercase tracking-widest">{msg.username}</span>
                        <div className={`px-4 py-2 rounded-2xl max-w-[90%] text-sm font-medium ${
                            msg.sender_id === user.id 
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-100 ' 
                                : 'bg-gray-100  text-gray-800  rounded-tl-none'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100  bg-gray-50 ">
                <div className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full pl-4 pr-12 py-3 bg-white  border border-gray-200  rounded-xl focus:ring-4 focus:ring-indigo-100  focus:outline-none shadow-sm  "
                    />
                    <button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 "
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatSidebar;

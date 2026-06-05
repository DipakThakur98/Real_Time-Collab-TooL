import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock, Search, ExternalLink, User } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (err) {
            showToast('Failed to fetch orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (orderId) => {
        if (!window.confirm('Are you sure you want to confirm this payment and upgrade the user?')) return;
        
        try {
            await api.put(`/admin/orders/${orderId}/confirm`);
            showToast('Order confirmed successfully');
            fetchOrders(); // Refresh list
        } catch (err) {
            showToast('Failed to confirm order', 'error');
        }
    };

    const filteredOrders = orders.filter(order => 
        order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-gray-900 dark:text-white">Loading orders...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Payment Orders</h2>
                    <p className="text-gray-400 font-medium mt-1">Review and confirm user subscriptions manually.</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search orders..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white dark:bg-[#15171e] border border-gray-200 dark:border-[#1e212b] text-gray-900 dark:text-white pl-12 pr-6 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-80 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white dark:bg-[#15171e] border border-gray-200 dark:border-[#1e212b] rounded-2xl p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto">
                            <CreditCard size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No orders found</h3>
                        <p className="text-gray-400 max-w-xs mx-auto">Once users start buying plans, they will appear here for verification.</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-[#15171e] border border-gray-200 dark:border-[#1e212b] rounded-2xl p-6 hover:border-gray-700 transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {order.status === 'completed' ? <CheckCircle size={28} /> : <Clock size={28} />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">{order.full_name || order.username}</span>
                                            <span className="text-xs font-medium text-gray-500">@{order.username}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                                            <span className="flex items-center gap-1.5"><CreditCard size={14} /> {order.plan_name} Plan</span>
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 text-right">
                                    <div className="space-y-1">
                                        <div className="text-xl font-black text-gray-900 dark:text-white">₹{order.amount}</div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {order.status}
                                        </div>
                                    </div>
                                    
                                    {order.status === 'pending' && (
                                        <button 
                                            onClick={() => handleConfirm(order.id)}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                                        >
                                            Confirm Payment
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminOrders;

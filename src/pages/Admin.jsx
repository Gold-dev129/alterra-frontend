import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Package, ShoppingBag, Trash2, AlertCircle,
    Image, Loader2, Type, Tag, CheckCircle2, Palette, Upload
} from 'lucide-react';
import { io } from 'socket.io-client';

export default function Admin() {
    const { products, orders, fetchOrders, updateOrderStatus, addProduct, updateProduct, deleteProduct, loading } = useProducts();
    const { token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState(null); // ID of product being edited
    const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'branding'
    const [settings, setSettings] = useState({ logo_url: '', dashboard_header_url: '' });
    const [isUpdatingBranding, setIsUpdatingBranding] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [newOrderAlert, setNewOrderAlert] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '10',
        isNewIn: false,
        colors: ''
    });
    const [images, setImages] = useState([]);
    const [dashboardHeaderImg, setDashboardHeaderImg] = useState('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop');

    useEffect(() => {
        if (token) {
            fetchOrders(token).then(() => {
                console.log('--- ADMIN DEBUG: Orders Fetched ---', orders);
            });
        }

        // Socket Integration for Real-time Alerts
        const socket = io('https://alterra-node.onrender.com');

        socket.on('newOrder', (data) => {
            console.log('New order received:', data);
            setNewOrderAlert(data);
            fetchOrders(token); // Refresh orders list automatically
            // Clear alert after 10 seconds
            setTimeout(() => setNewOrderAlert(null), 10000);
        });

        return () => socket.disconnect();
    }, [token]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('https://alterra-node.onrender.com/api/settings');
                const data = await response.json();
                if (data.status === 'success') {
                    setSettings(data.data);
                    if (data.data.dashboard_header_url) setDashboardHeaderImg(data.data.dashboard_header_url);
                }
            } catch (err) {
                console.error('Failed to fetch settings:', err);
            }
        };
        fetchSettings();
    }, []);

    const handleUpdateSetting = async (key, value) => {
        setIsUpdatingBranding(true);
        try {
            const response = await fetch('https://alterra-node.onrender.com/api/settings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key, value })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setSettings(prev => ({ ...prev, [key]: value }));
                setStatus({ type: 'success', message: `${key.replace(/_/g, ' ')} updated successfully!` });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to update branding.' });
        } finally {
            setIsUpdatingBranding(false);
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleEdit = (product) => {
        setEditId(product._id);
        setFormData({
            name: product.name || '',
            price: product.price || '',
            description: product.description || '',
            stock: product.stock || '10',
            isNewIn: product.isNewIn || false,
            colors: (product.colors || []).join(', ')
        });
        setImages([]);
        setActiveTab('products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setFormData({ name: '', price: '', description: '', stock: '10', isNewIn: false, colors: '' });
        setImages([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('stock', formData.stock);
        data.append('isNewIn', formData.isNewIn);
        data.append('colors', formData.colors);

        for (let i = 0; i < images.length; i++) {
            data.append('images', images[i]);
        }

        let result;
        if (editId) {
            result = await updateProduct(editId, data, token);
        } else {
            result = await addProduct(data, token);
        }

        if (result.success) {
            setStatus({
                type: 'success',
                message: editId ? 'Product updated successfully' : 'Product launched successfully'
            });
            handleCancelEdit();
        } else {
            setStatus({ type: 'error', message: result.message || 'Operation failed' });
        }

        setIsSubmitting(false);
        setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this item from the collection?')) {
            await deleteProduct(id, token);
        }
    };

    const handleClearOrders = async () => {
        if (window.confirm('⚠️ CRITICAL: Are you sure you want to PERMANENTLY delete ALL orders? This cannot be undone.')) {
            try {
                const response = await fetch('https://alterra-node.onrender.com/api/orders/all', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    setStatus({ type: 'success', message: 'All orders cleared successfully' });
                    fetchOrders(token);
                } else {
                    setStatus({ type: 'error', message: 'Failed to clear orders' });
                }
            } catch (err) {
                setStatus({ type: 'error', message: 'Network error while clearing orders' });
            }
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-slate-50">
            <AnimatePresence>
                {newOrderAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm px-4"
                    >
                        <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-white animate-bounce" />
                            </div>
                            <h3 className="text-sm font-serif font-bold italic">New Order Received!</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">
                                A new piece from {newOrderAlert.customerName} has been recorded.
                            </p>
                            <button
                                onClick={() => { setActiveTab('orders'); setNewOrderAlert(null); }}
                                className="w-full bg-white text-slate-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                            >
                                View Order Details
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Dashboard Navigation */}
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/4 space-y-3">
                        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl shadow-slate-200">
                            <img src={dashboardHeaderImg} alt="Admin Branding" className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent" />
                            <div className="absolute bottom-6 left-6">
                                <h1 className="text-white text-lg font-serif italic font-bold">Studio Dashboard</h1>
                                <p className="text-white/60 text-[8px] font-bold uppercase tracking-[0.3em]">Management Suite v2.0</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'products' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                        >
                            <Package className="w-5 h-5" />
                            <span className="font-bold text-xs uppercase tracking-widest">Collection Assets</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="font-bold text-xs uppercase tracking-widest">Custom Orders</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('branding')}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'branding' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                        >
                            <Palette className="w-5 h-5" />
                            <span className="font-bold text-xs uppercase tracking-widest">Branding</span>
                        </button>

                        <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Admin Notice</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed italic">
                                Use this portal to manage your digital inventory and process custom garment requests. Branding changes update the browser interface live.
                            </p>
                        </div>
                    </div>

                    <div className="lg:w-3/4">
                        {status.message && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-8 p-6 rounded-[2rem] border flex items-center gap-4 ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">{status.message}</span>
                            </motion.div>
                        )}

                        {activeTab === 'products' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 p-10 space-y-8 border border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-serif font-bold text-slate-900 italic uppercase underline decoration-slate-100 underline-offset-8">
                                            {editId ? 'Refine Product' : 'Add to Collection'}
                                        </h2>
                                        {editId && (
                                            <button type="button" onClick={handleCancelEdit} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2">
                                                Cancel Refinement
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input required name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="input-admin pl-12" />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-bold text-lg">₦</span>
                                                <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="input-admin pl-12" />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <textarea required name="description" value={formData.description} onChange={handleChange} placeholder="Product Story / Description" className="input-admin min-h-[120px] py-4 px-4" />
                                        </div>

                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input name="colors" value={formData.colors} onChange={handleChange} placeholder="Colors (e.g. Black, White, Brown)" className="input-admin pl-12" />
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-4">Separate with commas for multiple choices</p>
                                        </div>

                                        <div
                                            className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white transition-colors"
                                            onClick={() => setFormData({ ...formData, isNewIn: !formData.isNewIn })}
                                        >
                                            <div className={`w-10 h-6 rounded-full transition-colors relative ${formData.isNewIn ? 'bg-slate-900' : 'bg-slate-200'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isNewIn ? 'left-5' : 'left-1'}`} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">Show \"New In\" Badge</span>
                                        </div>

                                        <div className="relative group">
                                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 transition-all group-hover:border-slate-400 group-hover:bg-slate-50 flex flex-col items-center justify-center text-center">
                                                <Image className="w-10 h-10 text-slate-300 mb-2 group-hover:text-slate-500 transition-colors" />
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Add Imagery (Black, White, etc.)</p>
                                                <p className="text-[10px] text-slate-300">Select multiple files to enable the carousel</p>
                                                <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                            {images.length > 0 && (
                                                <div className="mt-2 text-center text-xs text-green-600 font-bold">
                                                    {images.length} files selected
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full btn-premium py-5 flex items-center justify-center gap-2 group"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                {editId ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                {editId ? 'Update Product' : 'Launch Product'}
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-8 space-y-4">
                                    <h2 className="text-xl font-serif font-bold text-slate-900 italic px-2">Active Collection ({products.length})</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {loading ? (
                                            <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-200" /></div>
                                        ) : products.length === 0 ? (
                                            <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 italic text-slate-400">
                                                No pieces listed yet.
                                            </div>
                                        ) : (
                                            products.map((p) => (
                                                <motion.div
                                                    key={p._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="group relative flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all overflow-hidden"
                                                >
                                                    <div className="w-20 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                                                        <img src={`${(p.images[0] || '').replace(/\\/g, '/')}`} alt=\"\" className=\"w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all\" />
                                                    </div>
                                                    <div className=\"flex-grow\">
                                                        <h3 className=\"font-serif italic text-lg text-slate-900 uppercase tracking-tighter truncate max-w-[200px] sm:max-w-none\">{p.name}</h3>
                                                        <div className=\"flex items-center gap-3 mt-1\">
                                                            <p className=\"font-bold text-slate-900 text-sm\">₦{p.price.toFixed(2)}</p>
                                                            {p.colors && p.colors.length > 0 && (
                                                                <div className=\"flex gap-1\">
                                                                    {p.colors.map((c, i) => (
                                                                        <div key={i} className=\"w-2 h-2 rounded-full border border-slate-100\" style={{ backgroundColor: c.replace(/\s+/g, '').toLowerCase() }} title={c} />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className=\"absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all\">
                                                        <button
                                                            onClick={() => handleEdit(p)}
                                                            className=\"p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm\"
                                                            title=\"Edit Product\"
                                                        >
                                                            <Type className=\"w-4 h-4\" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(p._id)}
                                                            className=\"p-3 rounded-xl bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all\"
                                                            title=\"Delete Product\"
                                                        >
                                                            <Trash2 className=\"w-4 h-4\" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'orders' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className=\"space-y-6\"
                            >
                                <div className=\"bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-6\">
                                    <div>
                                        <h1 className=\"text-3xl font-serif font-bold italic tracking-tight uppercase underline decoration-white/20 underline-offset-8\">Custom Orders</h1>
                                        <p className=\"text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60\">Management Panel</p>
                                    </div>
                                    <button 
                                        onClick={handleClearOrders}
                                        className=\"bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all\"
                                    >
                                        Clear All Orders
                                    </button>
                                </div>

                                <div className=\"space-y-4\">
                                    {loading ? (
                                        <div className=\"py-20 flex justify-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100\"><Loader2 className=\"w-8 h-8 animate-spin text-slate-200\" /></div>
                                    ) : orders.length === 0 ? (
                                        <div className=\"py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100\">
                                            <ShoppingBag className=\"w-12 h-12 text-slate-100 mx-auto mb-4\" />
                                            <p className=\"italic text-slate-400\">No custom orders received yet.</p>
                                        </div>
                                    ) : (
                                        orders.map((order) => (
                                            <div key={order._id} className=\"bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all\">
                                                <div className=\"p-6 sm:p-8 space-y-6\">
                                                    <div className=\"flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-slate-50\">
                                                        <div>
                                                            <span className=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1\">Order Number</span>
                                                            <h4 className=\"font-mono font-bold text-slate-900\">{order.orderNumber}</h4>
                                                        </div>
                                                        <div>
                                                            <span className=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1\">Customer</span>
                                                            <p className=\"font-bold text-slate-900\">{order.shippingDetails?.firstName} {order.shippingDetails?.lastName}</p>
                                                            <div className=\"space-y-0.5\">
                                                                <p className=\"text-[10px] text-slate-500 lowercase\">{order.shippingDetails?.email}</p>
                                                                <p className=\"text-[10px] font-bold text-slate-900\">{order.shippingDetails?.phone}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1\">Logistics</span>
                                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${order.shippingDetails?.deliveryMethod === 'pickup' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-900 text-white'}`}>
                                                                {order.shippingDetails?.deliveryMethod === 'pickup' ? 'Self Pickup' : 'To Address'}
                                                            </span>
                                                            {order.shippingDetails?.deliveryMethod === 'delivery' && (
                                                                <p className=\"text-[10px] text-slate-500 mt-2 max-w-[150px] leading-tight font-medium italic\">
                                                                    {order.shippingDetails?.address}, {order.shippingDetails?.city}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className=\"flex items-center gap-4\">
                                                            <div className=\"relative group/status\">
                                                                <select
                                                                    value={order.status}
                                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value, token)}
                                                                    className={`appearance-none px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer outline-none transition-all ${order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                        order.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' :
                                                                            order.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                                'bg-slate-50 text-slate-600 border-slate-100'
                                                                        } border`}
                                                                >
                                                                    <option value=\"Pending\">Pending</option>
                                                                    <option value=\"Paid\">Paid</option>
                                                                    <option value=\"Processing\">Processing</option>
                                                                    <option value=\"Shipped\">Shipped</option>
                                                                    <option value=\"Delivered\">Delivered</option>
                                                                    <option value=\"Cancelled\">Cancelled</option>
                                                                </select>
                                                            </div>
                                                            <p className=\"text-lg font-bold text-slate-900\">₦{order.total?.toFixed(2) || '0.00'}</p>
                                                        </div>
                                                    </div>

                                                    <div className=\"space-y-4\">
                                                        <p className=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest\">Production Inputs</p>
                                                        {order.items?.map((item, idx) => (
                                                            <div key={idx} className=\"flex gap-6 items-start p-4 bg-slate-50/50 rounded-2xl border border-slate-100\">
                                                                <div className=\"w-16 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-100\">
                                                                    <img src={`${(item.image || '').replace(/\\/g, '/')}`} alt=\"\" className=\"w-full h-full object-contain\" />
                                                                </div>
                                                                <div className=\"flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6\">
                                                                    <div>
                                                                        <p className=\"font-serif italic text-slate-900 uppercase tracking-tight mb-1\">{item.name}</p>
                                                                        <p className=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest\">Qty: {item.quantity}</p>
                                                                    </div>
                                                                    <div className=\"flex gap-4\">
                                                                        <div>
                                                                            <span className=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1\">Size</span>
                                                                            <span className=\"px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg uppercase\">{item.size}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1\">Color</span>
                                                                            <div className=\"flex items-center gap-2\">
                                                                                <div className=\"w-4 h-4 rounded-full border border-slate-200\" style={{ backgroundColor: item.color?.toLowerCase() }} />
                                                                                <span className=\"text-xs font-bold text-slate-900\">{item.color}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className=\"col-span-full sm:col-span-2 md:col-span-1 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6\">
                                                                        <span className=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 underline\">Custom Note</span>
                                                                        <p className=\"text-xs italic text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-50\">
                                                                            {item.customNote || \"No extra message provided.\"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className=\"p-4 bg-slate-900/5 rounded-2xl border border-slate-100\">
                                                        <p className=\"text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 opacity-60\">Shipping Address Summary</p>
                                                        <p className=\"text-xs text-slate-600 italic\">
                                                            {order.shippingDetails?.address}, {order.shippingDetails?.city}, {order.shippingDetails?.zipCode}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'branding' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className=\"space-y-8\"
                            >
                                <div className=\"bg-white rounded-[2rem] shadow-xl shadow-slate-200 overflow-hidden border border-slate-100\">
                                    <div className=\"bg-slate-900 p-10\">
                                        <h2 className=\"text-3xl font-serif font-bold text-white italic tracking-tight uppercase underline decoration-white/20 underline-offset-8\">Brand Identity</h2>
                                        <p className=\"text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 opacity-80\">Official Logo & General Assets</p>
                                    </div>
                                    
                                    <div className=\"p-10 space-y-12\">
                                        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-10 items-center\">
                                            <div className=\"space-y-4\">
                                                <h3 className=\"text-xl font-serif font-bold text-slate-900 uppercase tracking-tight italic\">Storefront Logo</h3>
                                                <p className=\"text-slate-400 text-xs leading-relaxed\">This logo will replace the text \"ALTERRA\" in the header and set the browser favicon.</p>
                                                <div className=\"flex gap-4 pt-4\">
                                                    <label className=\"flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer\">
                                                        <Upload className=\"w-4 h-4\" />
                                                        {isUpdatingBranding ? 'Processing...' : 'Upload New Logo'}
                                                        <input 
                                                            type=\"file\" 
                                                            className=\"hidden\" 
                                                            accept=\"image/*\"
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (!file) return;
                                                                const formData = new FormData();
                                                                formData.append('image', file);
                                                                try {
                                                                    setIsUpdatingBranding(true);
                                                                    const res = await fetch('https://alterra-node.onrender.com/api/products/upload', {
                                                                        method: 'POST',
                                                                        body: formData
                                                                    });
                                                                    const data = await res.json();
                                                                    if (data.url) await handleUpdateSetting('logo_url', data.url);
                                                                } catch (err) {
                                                                    setStatus({ type: 'error', message: 'Logo upload failed.' });
                                                                } finally {
                                                                    setIsUpdatingBranding(false);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className=\"bg-slate-50 flex items-center justify-center p-10 rounded-[2.5rem] border border-dashed border-slate-200 min-h-[200px]\">
                                                {settings.logo_url ? (
                                                    <img src={settings.logo_url} alt=\"Official Logo\" className=\"max-h-24 w-auto object-contain\" />
                                                ) : (
                                                    <span className=\"text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]\">No Logo Set</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className=\"h-px bg-slate-100\" />

                                        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-left\">
                                            <div className=\"space-y-4\">
                                                <h3 className=\"text-xl font-serif font-bold text-slate-900 uppercase tracking-tight italic\">Dashboard Hero</h3>
                                                <p className=\"text-slate-400 text-xs leading-relaxed\">The atmospheric image displayed at the top of your product management screen.</p>
                                                <div className=\"flex gap-4 pt-4\">
                                                    <label className=\"flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer\">
                                                        <Upload className=\"w-4 h-4\" />
                                                        Update Hero Image
                                                        <input 
                                                            type=\"file\" 
                                                            className=\"hidden\" 
                                                            accept=\"image/*\"
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (!file) return;
                                                                const formData = new FormData();
                                                                formData.append('image', file);
                                                                try {
                                                                    setIsUpdatingBranding(true);
                                                                    const res = await fetch('https://alterra-node.onrender.com/api/products/upload', {
                                                                        method: 'POST',
                                                                        body: formData
                                                                    });
                                                                    const data = await res.json();
                                                                    if (data.url) {
                                                                        await handleUpdateSetting('dashboard_header_url', data.url);
                                                                        setDashboardHeaderImg(data.url);
                                                                    }
                                                                } catch (err) {
                                                                    setStatus({ type: 'error', message: 'Hero upload failed.' });
                                                                } finally {
                                                                    setIsUpdatingBranding(false);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className=\"relative aspect-video rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg\">
                                                <img src={dashboardHeaderImg} alt=\"Hero Preview\" className=\"w-full h-full object-cover\" />
                                                <div className=\"absolute inset-0 bg-black/20\" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

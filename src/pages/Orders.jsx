import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Package, Loader2, Calendar, CreditCard, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('https://alterra-node.onrender.com/api/orders/mine', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setOrders(data.data.orders);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-50 border-green-100';
      case 'Shipped': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Delivered': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-200" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Loading Order History...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold italic text-slate-900 leading-tight uppercase tracking-tight">Your History</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 ml-1">Track your Alterra Studio pieces</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <ShoppingBag className="w-4 h-4 text-slate-900" />
            <span className="text-xs font-bold text-slate-900">{orders.length} Total Orders</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-6" />
            <p className="text-xl font-serif italic text-slate-400 mb-8">You haven't added any pieces to your collection yet.</p>
            <button
              onClick={() => navigate('/')}
              className="btn-premium px-10 py-4"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, idx) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 group"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-6 pb-8 border-b border-slate-50">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-900">
                          Order #{order.orderNumber}
                        </span>
                        <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ordered On</span>
                            <span className="text-xs font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Amount Paid</span>
                            <span className="text-xs font-bold text-slate-900">₦{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-50 pt-6 sm:pt-0 sm:pl-10">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Tracking</p>
                       <p className="text-sm font-serif italic text-slate-900">{order.status === 'Paid' ? 'Piece is being prepared' : order.status}</p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                      <Package className="w-3 h-3" /> Items in Order
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100/50">
                          <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0">
                            <img src={item.image ? item.image.replace(/\\/g, '/') : ''} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight truncate max-w-[150px]">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[8px] font-black bg-white px-1.5 py-0.5 rounded border border-slate-100 text-slate-400 uppercase">{item.size}</span>
                                <span className="text-[8px] font-black bg-white px-1.5 py-0.5 rounded border border-slate-100 text-slate-400 uppercase">{item.color}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-900 mt-1 opacity-60">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-20 p-8 bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl font-serif italic mb-4">Need help with an order?</h3>
                <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">Our studio team is available 24/7. Reach out via WhatsApp or email for immediate assistance.</p>
                <a href="mailto:alterraszn@gmail.com" className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all inline-block">Contact Studio</a>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}

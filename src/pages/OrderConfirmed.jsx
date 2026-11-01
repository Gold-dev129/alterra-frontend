import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

export default function OrderConfirmed() {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;
    const { clearCart } = useProducts();
    const { user } = useAuth();
    const hasClearedRef = useRef(false);

    useEffect(() => {
        // Unlock body scroll and remove any lingering Paystack overlay/iframes from payment
        try {
            document.body.style.overflow = 'auto';
            const paystackEls = document.querySelectorAll('iframe, .paystack-container, [id*="paystack"], [class*="paystack"]');
            paystackEls.forEach(el => el.remove());
        } catch (e) {
            console.error('Paystack cleanup error:', e);
        }

        if (!order) {
            navigate('/');
            return;
        }

        if (!hasClearedRef.current) {
            hasClearedRef.current = true;
            localStorage.removeItem('alterra_cart');
            try { clearCart(); } catch (e) { console.error(e); }
        }
    }, [order, navigate, clearCart]);

    const handleContinueShopping = () => {
        navigate('/products');
        window.location.hash = '#/products';
    };

    const handleViewOrderHistory = () => {
        const target = user ? '/my-orders' : '/signup';
        navigate(target);
        window.location.hash = `#${target}`;
    };

    if (!order) return null;

    return (
        <div className="min-h-screen pt-32 pb-24 bg-slate-50">
            <div className="container-custom max-w-4xl">
                <div className="bg-white rounded-[2rem] p-8 sm:p-12 border border-slate-100 shadow-sm text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-4xl font-serif font-bold italic text-slate-900 mb-4">Order Confirmed!</h1>
                    <p className="text-slate-500 mb-2">Thank you for your purchase, {order.shippingDetails?.firstName}. Your order number is <span className="font-bold text-slate-900">{order.orderNumber || 'Pending'}</span>.</p>
                    <p className="text-slate-500 text-sm mb-8">Confirmation email sent to <span className="font-bold text-slate-900">{order.shippingDetails?.email || 'your email'}</span>.</p>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10 text-left">
                        <h3 className="font-bold text-amber-900 mb-2">🚚 Delivery Information</h3>
                        <p className="text-amber-800 text-sm">Delivery takes 1-2 weeks. You will receive progress notifications as your order goes through production and shipping.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 text-left border border-slate-100">
                        <h2 className="text-2xl font-serif font-bold italic text-slate-900 mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            {(order.items || []).map((item, index) => (
                                <div key={index} className="flex gap-4 border-b border-slate-200 pb-4">
                                    <div className="w-16 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-100">
                                        {item.image ? (
                                            <img src={item.image.replace(/\\/g, '/')} alt={item.name} className="w-full h-full object-contain" />
                                        ) : <ShoppingBag className="w-full h-full p-4 text-slate-200" />}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                                        <p className="text-xs text-slate-500 mb-1">
                                            {item.size} / {item.color}
                                            {item.waist ? ` / ${item.waist} Waist` : ''}
                                            {item.height ? ` / Height: ${item.height}` : ''}
                                        </p>
                                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right flex flex-col justify-center">
                                        <span className="font-bold text-slate-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span>₦{(order.subtotal || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Service Fees</span>
                                <span>₦{(order.totalServiceFees || (order.items?.length * 1000) || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                                <span>Total Paid</span>
                                <span>₦{(order.total || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center relative z-50">
                        <button
                            type="button"
                            onClick={handleViewOrderHistory}
                            className="px-8 py-4 bg-slate-100 text-slate-900 font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                            View Order History
                        </button>
                        <button
                            type="button"
                            onClick={handleContinueShopping}
                            className="px-8 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-slate-800 transition-all cursor-pointer shadow-md active:scale-95"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

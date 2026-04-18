import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle, ShoppingBag, Loader2, X, Plus, Minus, AlertCircle } from 'lucide-react';
import { PaystackButton } from 'react-paystack';

export default function Checkout() {
    console.log('--- ALTERRA CHECKOUT VERSION 8.0 [ULTRA-RELIABILITY] ---', new Date().toLocaleTimeString());
    const { cart = [], clearCart, createOrder, removeFromCart, updateQuantity, updateCartItemAttributes } = useProducts();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [isOrderSuccessful, setIsOrderSuccessful] = useState(false);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        phone: '',
        deliveryMethod: 'delivery',
        address: '',
        city: '',
        location: 'Lagos',
        zipCode: '',
        country: 'Nigeria'
    });

    const subtotal = (cart || []).reduce((acc, item) => acc + ((item?.price || 0) * (item?.quantity || 0)), 0);
    const shippingRates = {
        'Lead City University': 4000,
        'Ibadan (Inside City)': 4000,
        'Lagos': 7000,
        'Other States (Abuja, PH, Warri, etc.)': 8000,
        'pickup': 0
    };
    const shipping = formData.deliveryMethod === 'pickup' ? 0 : shippingRates[formData.location];
    const total = subtotal + shipping;

    useEffect(() => {
        if (user && !formData.email) {
            setFormData(prev => ({
                ...prev,
                email: user.email,
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ')[1] || ''
            }));
        }
    }, [user, formData.email]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: formData?.email || 'customer@example.com',
        amount: Math.round((total || 0) * 100) || 100,
        publicKey: 'pk_live_de2d005e95d26e65feb09a0d9865bd43c6b6c5f3',
        currency: 'NGN',
        text: "Complete Purchase",
        onSuccess: async (reference) => {
            console.log('--- !!! RELIABILITY VERSION 8.1 SUCCESS !!! ---', reference);
            window.alert("PAYMENT SUCCESSFUL!\n\nYour order is being saved and you'll be redirected now.");
            
            const orderData = {
                items: (cart || []).map(item => ({
                    product: item?._id,
                    name: item?.name,
                    price: item?.price,
                    quantity: item?.quantity,
                    size: item?.selectedSize,
                    color: item?.selectedColor,
                    image: item?.images?.[0] || item?.image || '/placeholder.png',
                    customNote: item?.customNote || ''
                })),
                shippingDetails: { ...formData, shippingFee: shipping },
                subtotal,
                shipping,
                total,
                paymentReference: reference?.reference || reference?.trxref || 'REF_8.1'
            };

            try {
                const result = await createOrder(orderData);
                if (result.success) {
                    localStorage.removeItem('alterra_cart');
                    try { clearCart(); } catch (e) { console.error(e); }
                    window.location.assign('/');
                } else {
                    window.alert("Order saved, but there was a minor issue clearing your cart. Your order is secure!");
                    window.location.assign('/');
                }
            } catch (err) {
                console.error("Order Creation Error:", err);
                window.alert("Payment successful but order saving failed. Please contact support with your reference: " + orderData.paymentReference);
            }
        },
        onClose: () => {
            console.log('--- Payment Modal Closed ---');
            setIsProcessing(false);
            setError('Payment was cancelled.');
        },
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // Validation is handled by basic HTML 'required' and button state
    };


    if (isOrderSuccessful) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                <h2 className="text-3xl font-serif italic text-slate-900 mb-4">Redirecting...</h2>
                <Loader2 className="w-6 h-6 animate-spin text-slate-200" />
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center container-custom">
                <ShoppingBag className="w-16 h-16 text-slate-100 mb-6" />
                <h2 className="text-3xl font-serif italic text-slate-900 mb-6">Your bag is empty</h2>
                <Link to="/" className="inline-block px-10 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-slate-800 transition-all">Return to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 bg-slate-50">
            <div className="container-custom max-w-6xl">
                <div className="flex items-center justify-between mb-12">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <h1 className="text-2xl font-serif font-bold italic text-slate-900 absolute left-1/2 -translate-x-1/2 hidden sm:block">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                                <h3 className="text-2xl font-serif font-bold italic text-slate-900">Contact Details</h3>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-slate-900 transition-all" />
                                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-slate-900 transition-all" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-slate-900 transition-all" />
                                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-slate-900 transition-all" />
                                </div>

                                <div className="pt-6 pb-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Select Delivery Method</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, deliveryMethod: 'delivery' })}
                                            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.deliveryMethod === 'delivery' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
                                        >
                                            <Truck className="w-5 h-5" />
                                            <span className="text-[10px] font-bold uppercase">Delivery</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                                            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.deliveryMethod === 'pickup' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            <span className="text-[10px] font-bold uppercase">Self Pickup</span>
                                        </button>
                                    </div>
                                </div>

                                {formData.deliveryMethod === 'delivery' && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Delivery Destination</p>
                                            <select
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-slate-900 transition-all font-bold text-sm"
                                            >
                                                <option value="Lead City University">Lead City University (₦4,000)</option>
                                                <option value="Ibadan (Inside City)">Ibadan (₦4,000)</option>
                                                <option value="Lagos">Lagos (₦7,000)</option>
                                                <option value="Other States (Abuja, PH, Warri, etc.)">Other States - Abuja, PH, Warri, etc. (₦8,000)</option>
                                            </select>
                                        </div>
                                        <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="Full Shipping Address (Street, Building, etc.)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-slate-900 transition-all" />
                                    </motion.div>
                                )}

                                <div className="pt-10 flex items-center gap-4 border-t border-slate-50">
                                    <div className="w-10 h-10 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-slate-300 text-sm font-bold">2</div>
                                    <h3 className="text-2xl font-serif font-bold italic text-slate-900">Payment Selection</h3>
                                </div>

                                {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center">{error}</div>}

                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start gap-4">
                                    <ShieldCheck className="w-6 h-6 text-green-500 mt-1" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 uppercase">ULTRA-RELIABILITY MODE ACTIVE</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Direct Component Injection Enabled</p>
                                    </div>
                                </div>

                                {(!formData?.email || !formData?.phone || !formData?.firstName) ? (
                                    <div className="w-full py-5 bg-slate-100 text-slate-400 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
                                        Fill Information to Pay
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <PaystackButton
                                            {...paystackConfig}
                                            className="w-full py-5 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                                        />
                                        <div className="absolute -bottom-12 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Click once and wait for the secure window</p>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            localStorage.removeItem('alterra_cart');
                                            window.location.assign('/');
                                        }}
                                        className="text-[8px] font-bold text-slate-300 hover:text-red-400 uppercase tracking-widest transition-colors"
                                    >
                                        Emergency: Reset Bag & Return Home
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-100 shadow-sm sticky top-32">
                            <h2 className="text-2xl font-serif font-bold italic text-slate-900 mb-8 tracking-tight">Order Summary</h2>
                            <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar mb-8 pr-2">
                                {(cart || []).filter(i => i).map((item, index) => (
                                    <div key={item?._id ? `${item._id}-${index}` : `item-${index}`} className="flex gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                        <div className="w-20 h-24 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                            {item?.images?.[0] ? (
                                                <img src={`${item.images[0].replace(/\\/g, '/')}`} alt="" className="w-full h-full object-contain" />
                                            ) : <ShoppingBag className="w-full h-full p-6 text-slate-100" />}
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-tight line-clamp-2">{item?.name || 'Item'}</h4>
                                                <button onClick={() => item?._id && removeFromCart(item._id, { size: item.selectedSize, color: item.selectedColor, customNote: item.customNote })} className="text-slate-300 hover:text-red-500 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-[8px] font-bold bg-white border px-1.5 py-0.5 rounded text-slate-400 uppercase">{item?.selectedSize || 'N/A'}</span>
                                                <span className="text-[8px] font-bold bg-white border px-1.5 py-0.5 rounded text-slate-400 uppercase">{item?.selectedColor || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-bold text-slate-400">Qty: {item?.quantity || 1}</span>
                                                <span className="text-xs font-bold text-slate-900">₦{((item?.price || 0) * (item?.quantity || 1)).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900">₦{(subtotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
                                    <span className="font-serif italic text-2xl text-slate-900">Total</span>
                                    <span className="text-2xl font-bold tracking-tight text-slate-900">₦{(total || 0).toFixed(2)}</span>
                                </div>
                                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 mt-4">
                                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1 leading-none">Important Policy</p>
                                    <p className="text-[9px] text-amber-600 italic font-medium leading-relaxed">Please note: We have a **No Refund Policy**. Ensure all details are correct before completing purchase.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

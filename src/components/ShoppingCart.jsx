import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import CartItem from './CartItem';

export default function ShoppingCart() {
  const { cart, isCartOpen, setIsCartOpen, clearCart, cartTotal } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                <h2 className="text-2xl font-serif font-bold text-slate-900 italic">Bag <span className="text-slate-400 font-sans text-sm not-italic font-normal">({cart.length})</span></h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors group"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto px-8 py-6 no-scrollbar h-full">
              {cart.length > 0 ? (
                <div className="space-y-8">
                  {cart.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-slate-200" />
                  </div>
                  <div>
                    <p className="text-xl font-serif italic text-slate-900 mb-2">Your bag is empty</p>
                    <p className="text-sm text-slate-400 max-w-[200px]">Looks like you haven't added anything yet</p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="btn-premium px-10"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            {cart.length > 0 && (
              <div className="px-8 py-10 border-t border-slate-100 space-y-8 bg-slate-50/50">
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₦{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-slate-900 uppercase tracking-tighter">On Delivery</span>
                  </div>
                  <p className="text-[9px] text-slate-400 italic leading-relaxed">
                    * Delivery costs vary by location. Our studio will call you to confirm the final fee.
                  </p>
                  <div className="flex justify-between items-end pt-4 border-t border-slate-100">
                    <span className="font-serif italic text-xl text-slate-900">Total</span>
                    <div className="text-right">
                      <span className="block text-2xl font-bold tracking-tight text-slate-900">₦{total.toFixed(2)}</span>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Estimation Tax Included</p>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full btn-premium py-5 text-lg flex items-center justify-center gap-3 active:scale-[0.98]"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                {!user && (
                  <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    Login to save your bag for later
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

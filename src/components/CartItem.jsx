import React from 'react';
import { useProducts } from '../context/ProductContext';
import { motion } from 'framer-motion';
import { Minus, Plus, X, Trash2 } from 'lucide-react';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart, updateCartItemAttributes } = useProducts();

  const imageUrl = item.images && item.images.length > 0
    ? `${item.images[0].replace(/\\/g, '/')}`
    : 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop';

  const availableColors = (item.colors && item.colors.length > 0) ? item.colors : ['Black', 'White'];
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 group bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 hover:border-slate-200 transition-all"
    >
      <div className="w-20 h-28 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-100">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-contain transition-transform group-hover:scale-110 duration-500"
        />
      </div>

      <div className="flex-grow flex flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight line-clamp-1 pr-4">{item.name}</h4>
          </div>
          <button
            onClick={() => removeFromCart(item._id, { size: item.selectedSize, color: item.selectedColor, customNote: item.customNote })}
            className="text-slate-300 hover:text-red-500 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {/* Size Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-lg p-1">
            <span className="text-[8px] font-bold text-slate-400 uppercase px-1">Size</span>
            <select
              value={item.selectedSize}
              onChange={(e) => updateCartItemAttributes(item._id, { size: item.selectedSize, color: item.selectedColor, customNote: item.customNote }, { size: e.target.value, color: item.selectedColor })}
              className="text-[10px] font-bold bg-transparent outline-none cursor-pointer pr-1"
            >
              {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Color Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-lg p-1">
            <span className="text-[8px] font-bold text-slate-400 uppercase px-1">Color</span>
            <select
              value={item.selectedColor}
              onChange={(e) => updateCartItemAttributes(item._id, { size: item.selectedSize, color: item.selectedColor, customNote: item.customNote }, { size: item.selectedSize, color: e.target.value })}
              className="text-[10px] font-bold bg-transparent outline-none cursor-pointer pr-1"
            >
              {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-end mt-3">
          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1, { size: item.selectedSize, color: item.selectedColor, customNote: item.customNote })}
              className="p-1 hover:bg-slate-50 text-slate-400"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-[10px] font-bold text-slate-900 border-x border-slate-100">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1, { size: item.selectedSize, color: item.selectedColor, customNote: item.customNote })}
              className="p-1 hover:bg-slate-50 text-slate-400"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs font-bold text-slate-900">₦{(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
}

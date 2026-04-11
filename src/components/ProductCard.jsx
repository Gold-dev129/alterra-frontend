import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { ShoppingBag, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCard({ product, index }) {
  const navigate = useNavigate();
  const { addToCart } = useProducts();
  const [currentIdx, setCurrentIdx] = useState(0);

  const images = product.images && product.images.length > 0
    ? product.images.map(img => `${img.replace(/\\/g, '/')}`)
    : ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop'];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 rounded-2xl mb-6">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIdx}
            src={images[currentIdx]}
            alt={product.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={prevImage} className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-900 shadow-lg hover:bg-white transition-all transform hover:scale-110">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={nextImage} className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-900 shadow-lg hover:bg-white transition-all transform hover:scale-110">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? 'bg-slate-900 w-4' : 'bg-slate-300'}`} />
              ))}
            </div>
          </>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6 gap-3 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="bg-white text-slate-900 w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white pointer-events-auto"
          >
            <Plus className="w-4 h-4" /> Quick Add
          </button>
        </div>

        {/* Badge */}
        {product.isNewIn && (
          <span className="absolute top-4 left-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            New In
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-slate-900 font-serif text-xl group-hover:text-slate-500 transition-colors uppercase tracking-tight">{product.name}</h3>
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full border border-slate-200 shadow-sm"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="text-slate-900 font-semibold italic text-lg opacity-80">₦{product.price.toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Hexagon, Loader2, Minus, Plus, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, loading } = useProducts();
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Black');
    const [customNote, setCustomNote] = useState('');
    const [showSizeChart, setShowSizeChart] = useState(false);

    const product = products.find(p => p._id === id);

    // Default sizes for selection
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    // Default colors if product doesn't have any
    const defaultColors = ['Black', 'White'];
    const availableColors = (product?.colors && product.colors.length > 0) ? product.colors : defaultColors;

    useEffect(() => {
        if (product && availableColors.length > 0) {
            setSelectedColor(availableColors[0]);
        }
    }, [product, availableColors]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-3xl font-serif text-slate-900 mb-6 italic">Product not found.</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-premium flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    const images = product.images && product.images.length > 0
        ? product.images.map(img => `${img.replace(/\\/g, '/')}`)
        : ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop'];

    return (
        <div className="min-h-screen pt-32 pb-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/')}
                    className="mb-12 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start">
                    {/* Media Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <div className="bg-slate-50 rounded-[2rem] overflow-hidden aspect-[4/5] relative group shadow-sm">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImageIdx}
                                    src={images[selectedImageIdx]}
                                    alt={product.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full h-full object-contain object-center"
                                />
                            </AnimatePresence>


                            {images.length > 1 && (
                                <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
                                    {images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImageIdx(i)}
                                            className={`w-2 h-2 rounded-full transition-all ${selectedImageIdx === i ? 'bg-slate-900 w-8' : 'bg-slate-300'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-4">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImageIdx(i)}
                                        className={`aspect-[3/4] rounded-2xl bg-slate-50 border-2 cursor-pointer transition-all overflow-hidden ${selectedImageIdx === i ? 'border-slate-900' : 'border-transparent hover:border-slate-200'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div className="space-y-8">
                            <h1 className="text-4xl sm:text-6xl font-serif text-slate-900 italic leading-tight uppercase tracking-tight">{product.name}</h1>

                            {/* Selections Section */}
                            <div className="space-y-8 py-2">
                                {/* Size Selection */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Select Size</p>
                                        <button 
                                            onClick={() => setShowSizeChart(true)}
                                            className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-0.5 hover:text-slate-500 hover:border-slate-500 transition-all"
                                        >
                                            View Size Guide
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-xs transition-all ${selectedSize === size ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Selection */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Select Production Color</p>
                                    <div className="flex flex-wrap gap-3">
                                        {availableColors.map((color, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedColor(color)}
                                                className={`group flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${selectedColor === color ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white'}`}
                                            >
                                                <div
                                                    className="w-4 h-4 rounded-full border border-white/20 shadow-inner"
                                                    style={{ backgroundColor: color.replace(/\s+/g, '').toLowerCase() }}
                                                />
                                                <span className="text-xs font-bold uppercase tracking-tight">{color}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Selected Color:</span>
                                        <span className="text-xs font-black uppercase text-slate-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">{selectedColor}</span>
                                    </div>
                                </div>

                                {/* Custom Note */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Custom Notes (Optional)</p>
                                    <textarea
                                        value={customNote}
                                        onChange={(e) => setCustomNote(e.target.value)}
                                        placeholder="Add special instructions or preferences..."
                                        className="input-standard min-h-[80px] py-4 text-sm bg-slate-50 border-transparent focus:bg-white rounded-2xl"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                <p className="text-3xl text-slate-900 font-bold">₦{product.price.toFixed(2)}</p>
                                <span className="text-xs font-bold px-3 py-1 bg-slate-50 rounded-full border border-slate-100 uppercase tracking-widest text-slate-400">In Stock</span>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-500 leading-relaxed text-lg italic">
                                "{product.description}"
                            </p>
                        </div>

                        {/* Care Instructions */}
                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-2">
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                                <ShieldCheck className="w-4 h-4 text-slate-400" /> Care Instructions
                            </div>
                            <p className="text-xs text-slate-500 font-medium">100% Cotton</p>
                            <p className="text-xs text-slate-400 italic">Do not bleach • Cold wash only • Iron inside out</p>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 h-16 bg-slate-50/30">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-12 text-center text-lg font-bold text-slate-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        for (let i = 0; i < quantity; i++) {
                                            addToCart(product, {
                                                size: selectedSize,
                                                color: selectedColor,
                                                customNote: customNote
                                            });
                                        }
                                    }}
                                    className="flex-grow btn-premium h-16 flex items-center justify-center gap-3 uppercase tracking-widest text-sm shadow-xl shadow-slate-200"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    Add to Bag
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-10">
                            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                <h3 className="font-serif font-bold italic text-slate-900 mb-1 text-sm uppercase tracking-tighter">Tailored Fit</h3>
                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest leading-normal">Precision cut for a timeless silhouette.</p>
                            </div>
                            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 text-sm italic">
                                <h3 className="font-serif font-bold italic text-slate-900 mb-1 uppercase tracking-tighter">Premium Fabric</h3>
                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest leading-normal">Selected materials for maximum comfort.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Size Chart Modal */}
            <AnimatePresence>
                {showSizeChart && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSizeChart(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                        >
                            <div className="bg-slate-900 p-8 text-white relative">
                                <h3 className="text-3xl font-serif italic font-bold">Shirt Size Guide</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Tees • Long Sleeves • Raglan</p>
                                <button 
                                    onClick={() => setShowSizeChart(false)}
                                    className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="p-8 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-900">
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Size</th>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Chest (in)</th>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Length (in)</th>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Sleeve (in)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {[
                                            { s: 'Small (S)', c: '36', l: '26.5', v: '22.5' },
                                            { s: 'Medium (M)', c: '40', l: '27', v: '24' },
                                            { s: 'Large (L)', c: '43', l: '28.5', v: '25' },
                                            { s: 'X-Large (XL)', c: '47', l: '30', v: '26' },
                                            { s: 'XX-Large (XXL)', c: '51', l: '31', v: '27' }
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                <td className="py-4 font-black text-slate-900">{row.s}</td>
                                                <td className="py-4 text-center font-bold text-slate-600 bg-slate-50/30">{row.c}</td>
                                                <td className="py-4 text-center font-medium text-slate-500">{row.l}</td>
                                                <td className="py-4 text-center font-medium text-slate-500 bg-slate-50/30">{row.v}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pro Tip:</p>
                                    <p className="text-xs text-slate-600 italic leading-relaxed">
                                        For an oversized/baggy fit, we recommend ordering one size up from your standard measurement.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

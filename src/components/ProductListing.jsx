import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

export default function ProductListing() {
  const { filteredProducts, loading, error } = useProducts();
  const sortedProducts = filteredProducts;

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400 text-center px-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="font-bold tracking-[0.3em] text-[10px] uppercase">Curating Collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-slate-500 container-custom">
        <p className="font-serif italic text-xl">Failed to load collection. <br /> Check connection to the ALTERRA studio.</p>
      </div>
    );
  }

  return (
    <section id="collection" className="py-32 bg-white">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center mb-24 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl font-serif text-slate-900 leading-tight uppercase tracking-[0.2em]"
          >
            ALTERRA&apos;S COLLECTION
          </motion.h2>
          <div className="w-24 h-px bg-slate-200 mt-8" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
          {sortedProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-slate-50 rounded-[3rem]">
            <p className="text-slate-300 font-serif italic text-2xl">No items match your criteria. <br /> Refine your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}

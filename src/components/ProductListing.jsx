import React from 'react';
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
    <section id="collection" className="pt-12 pb-24 bg-white">
      <div className="container-custom">

        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-10 gap-y-10 sm:gap-y-20">
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

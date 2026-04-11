import React from 'react';
import { motion } from 'framer-motion';
import heroBg from '../assets/hero-bg.jpg';

export default function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0a0a0a]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/30 z-10" />
                <img
                    src={heroBg}
                    alt="Hero Background"
                    className="w-full h-full object-cover object-[center_20%]"
                />
            </div>

            {/* Centered Button */}
            <div className="relative z-20 flex items-center justify-center w-full h-full">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
                    className="group relative overflow-hidden px-12 py-5 bg-white text-black font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-black hover:text-white"
                >
                    <span className="relative z-10">SHOP NOW</span>
                    <div className="absolute inset-0 bg-black translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </motion.button>
            </div>

            {/* Side Branding - Kept for premium feel but made more subtle */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-20 items-center z-20">
                <span className="text-white/40 text-[10px] uppercase tracking-[1em] rotate-90 whitespace-nowrap">ALTERRA STUDIO</span>
                <div className="w-px h-24 bg-white/20" />
                <span className="text-white/40 text-[10px] uppercase tracking-[1em] rotate-90 whitespace-nowrap">EST 2024</span>
            </div>
        </section>
    );
}


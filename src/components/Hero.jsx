import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroBg from '../assets/hero-bg.jpg';
import { useProducts } from '../context/ProductContext';

export default function Hero() {
    const navigate = useNavigate();
    const { settings } = useProducts();
    const [heroImageFailed, setHeroImageFailed] = useState(false);
    const bgImage = (settings?.dashboard_header_url && !heroImageFailed) ? settings.dashboard_header_url : heroBg;

    return (
        <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-between bg-[#0a0a0a] py-12">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src={bgImage}
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                    onError={() => setHeroImageFailed(true)}
                />
            </div>

            {/* Top spacer to balance vertical centering */}
            <div className="h-10 z-20" />

            {/* Centered Button */}
            <div className="relative z-20 flex items-center justify-center">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    onClick={() => navigate('/products')}
                    className="group relative overflow-hidden px-12 py-5 bg-white text-black font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-black hover:text-white rounded-xl shadow-2xl"
                >
                    <span className="relative z-10">SHOP NOW</span>
                    <div className="absolute inset-0 bg-black translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </motion.button>
            </div>

            {/* Bottom section with Social Icons */}
            <div className="relative z-20 flex flex-col items-center gap-3">
                <div className="flex items-center gap-6 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg font-sans">
                    <a 
                        href="https://snapchat.com/t/ULVErLNp" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/60 hover:text-white transition-all transform hover:scale-110 text-xs font-bold uppercase tracking-wider px-1"
                        title="Snapchat"
                    >
                        S
                    </a>

                    <a 
                        href="https://www.tiktok.com/@alterra.official?_r=1&_ZS-94RDQyPzcUE" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/60 hover:text-white transition-all transform hover:scale-110"
                        title="TikTok"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.44-.24-.16-.48-.34-.7-.52v7.21c.01 3.58-1.9 6.75-5.3 7.89-1.39.46-2.9.54-4.32.25-3.05-.62-5.39-3.32-5.74-6.39-.41-3.66 1.88-7.23 5.42-8.31.25-.07.51-.12.78-.15v4.03c-.11.02-.22.05-.33.09-1.9.62-3.02 2.65-2.61 4.61.32 1.53 1.51 2.82 3.03 3.19.86.21 1.78.11 2.58-.25 1.11-.5 1.83-1.61 1.82-2.82V.02z" />
                        </svg>
                    </a>

                    <a 
                        href="https://x.com/alterraszn?s=11" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/60 hover:text-white transition-all transform hover:scale-110"
                        title="X (Twitter)"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </a>

                    <a 
                        href="mailto:alterraszn@gmail.com" 
                        className="text-white/60 hover:text-white transition-all transform hover:scale-110"
                        title="Gmail"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </a>
                </div>
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


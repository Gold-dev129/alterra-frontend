import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroBg from '../assets/hero-bg.jpg';
import { useProducts } from '../context/ProductContext';

export default function Hero() {
    const navigate = useNavigate();
    const { settings } = useProducts();
    const bgImage = settings?.dashboard_header_url || heroBg;

    return (
        <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-between bg-[#0a0a0a] py-12">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src={bgImage}
                    alt="Hero Background"
                    className="w-full h-full object-cover"
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
                <div className="flex items-center gap-6 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
                    <a 
                        href="https://snapchat.com/t/Gh7wXpDR" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/60 hover:text-white transition-all transform hover:scale-110"
                        title="Snapchat"
                    >
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                            <path d="M15.943 11.526c-.111-.303-.323-.465-.564-.599a1.416 1.416 0 0 0-.123-.064l-.219-.111c-.752-.399-1.339-.902-1.746-1.498a3.387 3.387 0 0 1-.3-.531c-.034-.1-.032-.156-.008-.207a.338.338 0 0 1 .097-.1.129-.086.262-.173.352-.231.162-.104.289-.187.371-.245.309-.216.525-.446.66-.702a1.397 1.397 0 0 0 .069-1.16c-.205-.538-.713-.872-1.329-.872a1.829 1.829 0 0 0-.487.065c.006-.368-.002-.757-.035-1.139-.116-1.344-.587-2.048-1.077-2.61a4.294 4.294 0 0 0-1.095-.881C9.764.216 8.92 0 7.999 0c-.92 0-1.76.216-2.505.641-.412.232-.782.53-1.097.883-.49.562-.96 1.267-1.077 2.61-.033.382-.04.772-.036 1.138a1.83 1.83 0 0 0-.487-.065c-.615 0-1.124.335-1.328.873a1.398 1.398 0 0 0 .067 1.161c.136.256.352.486.66.701.082.058.21.14.371.246l.339.221a.38.38 0 0 1 .109.11c.026.053.027.11-.012.217a3.363 3.363 0 0 1-.295.52c-.398.583-.968 1.077-1.696 1.472-.385.204-.786.34-.955.8-.128.348-.044.743.28 1.075.119.125.257.23.409.31a4.43 4.43 0 0 0 1 .4.66.66 0 0 1 .202.09c.118.104.102.26.259.488.079.118.18.22.296.3.33.229.701.243 1.095.258.355.014.758.03 1.217.18.19.064.389.186.618.328.55.338 1.305.802 2.566.802 1.262 0 2.02-.466 2.576-.806.227-.14.424-.26.609-.321.46-.152.863-.168 1.218-.181.393-.015.764-.03 1.095-.258a1.14 1.14 0 0 0 .336-.368c.114-.192.11-.327.217-.42a.625.625 0 0 1 .19-.087 4.446 4.446 0 0 0 1.014-.404c.16-.087.306-.2.429-.336l.004-.005c.304-.325.38-.709.256-1.047m-1.121.602c-.684.378-1.139.337-1.493.565-.3.193-.122.61-.34.76-.269.186-1.061-.012-2.085.326-.845.279-1.384 1.082-2.903 1.082s-2.045-.801-2.904-1.084c-1.022-.338-1.816-.14-2.084-.325-.218-.15-.041-.568-.341-.761-.354-.228-.809-.187-1.492-.563-.436-.24-.189-.39-.044-.46 2.478-1.199 2.873-3.05 2.89-3.188.022-.166.045-.297-.138-.466-.177-.164-.962-.65-1.18-.802-.36-.252-.52-.503-.402-.812.082-.214.281-.295.49-.295a1 1 0 0 1 0 0z" />
                        </svg>
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


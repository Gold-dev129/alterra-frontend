1: import React from 'react';
2: import { Link } from 'react-router-dom';
3: import { Mail, Music, Ghost } from 'lucide-react';
4: 
5: export default function Footer() {
6:   const scrollToTop = () => {
7:     window.scrollTo({ top: 0, behavior: 'smooth' });
8:   };
9: 
10:   return (
11:     <footer className="bg-slate-900 pt-24 pb-12">
12:       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
13:         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
14:           {/* Brand Section */}
15:           <div className="space-y-6">
16:             <button onClick={scrollToTop} className="text-3xl font-serif font-bold tracking-tighter text-white uppercase italic hover:opacity-80 transition-opacity">
17:               ALTERRA
18:             </button>
19:             <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
20:               Crafting timeless pieces for the modern individual. Quality, sustainability, and elegance defined in every thread.
21:             </p>
22:             <div className="flex items-center space-x-5">
23:               <a href="mailto:alterraszn@gmail.com" className="text-slate-400 hover:text-white transition-colors" title="Gmail">
24:                 <Mail className="w-5 h-5" />
25:               </a>
26:               <a href="https://www.tiktok.com/@alterra.official?_r=1&_ZS-94RDQyPzcUE" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="TikTok">
27:                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
28:                   <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.44-.24-.16-.48-.34-.7-.52v7.21c.01 3.58-1.9 6.75-5.3 7.89-1.39.46-2.9.54-4.32.25-3.05-.62-5.39-3.32-5.74-6.39-.41-3.66 1.88-7.23 5.42-8.31.25-.07.51-.12.78-.15v4.03c-.11.02-.22.05-.33.09-1.9.62-3.02 2.65-2.61 4.61.32 1.53 1.51 2.82 3.03 3.19.86.21 1.78.11 2.58-.25 1.11-.5 1.83-1.61 1.82-2.82V.02z" />
29:                 </svg>
30:               </a>
31:               <a href="https://snapchat.com/t/Gh7wXpDR" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Snapchat">
32:                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
33:                   <path d="M12 2.75c-3.17 0-5.75 2.58-5.75 5.75 0 2.29 1.34 4.26 3.28 5.17-.11.08-.2.18-.27.3l-1.32 1.98c-.12.18-.12.41 0 .59.08.13.22.21.37.21h7.48c.15 0 .29-.08.37-.21.12-.18.12-.41 0-.59l-1.32-1.98c-.07-.12-.16-.22-.27-.3 1.94-.91 3.28-2.88 3.28-5.17 0-3.17-2.58-5.75-5.75-5.75zM12 4.25c2.35 0 4.25 1.9 4.25 4.25 0 1.87-1.2 3.46-2.87 4.04-.15.05-.28.16-.35.31l-1.03 1.55-1.03-1.55c-.07-.15-.2-.26-.35-.31-1.67-.58-2.87-2.17-2.87-4.04 0-2.35 1.9-4.25 4.25-4.25zm-5 14.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5h10c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5H7z" />
34:                 </svg>
35:               </a>
36:             </div>
37:           </div>
38: 
39:           {/* Quick Links */}
40:           <div>
41:             <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-8">Shop Selection</h4>
42:             <ul className="space-y-4">
43:               <li><button onClick={scrollToTop} className="text-slate-400 hover:text-white text-sm transition-colors">All Products</button></li>
44:               <li><button onClick={scrollToTop} className="text-slate-400 hover:text-white text-sm transition-colors">New Arrivals</button></li>
45:               <li><button onClick={scrollToTop} className="text-slate-400 hover:text-white text-sm transition-colors">Bestsellers</button></li>
46:               <li><button onClick={scrollToTop} className="text-slate-400 hover:text-white text-sm transition-colors">Exclusive Collections</button></li>
47:             </ul>
48:           </div>
49: 
50:           <div className="md:col-span-2 mt-8 md:mt-0 pt-12 border-t border-white/5">
51:                 <h4 className="text-white font-bold uppercase tracking-wider text-[10px] mb-4 opacity-50 underline decoration-slate-700 underline-offset-4">Legal & Policy</h4>
52:                 <p className="text-slate-500 text-[11px] italic leading-relaxed max-w-2xl">
53:                     <span className="text-amber-500/80 font-bold not-italic uppercase tracking-widest mr-2">No Refund Policy:</span>
54:                     At ALTERRA STUDIO, every piece is prepared with meticulous care. Due to the exclusive and bespoke nature of our items, we maintain a strict **No Refund Policy**. Please ensure you check your size and color selections before completing your order.
55:                 </p>
56:           </div>
57:         </div>
58: 
59:         {/* Bottom Bar */}
60:         <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
61:           <p className="text-slate-600 text-[9px] uppercase tracking-[0.2em] font-black">
62:             © 2026 ALTERRA CLOTHING BRAND. ALL RIGHTS RESERVED.
63:           </p>
64:         </div>
65:       </div>
66:     </footer>
67:   );
68: }

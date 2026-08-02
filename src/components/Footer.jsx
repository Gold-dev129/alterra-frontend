import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Music, Ghost } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavToProducts = () => {
    navigate('/products');
    scrollToTop();
  };

  return (
    <footer className="bg-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Brand Section */}
          <div className="space-y-6">
            <button onClick={scrollToTop} className="text-3xl font-serif font-bold tracking-tighter text-white uppercase italic hover:opacity-80 transition-opacity">
              ALTERRA
            </button>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Crafting timeless pieces for the modern individual. Quality, sustainability, and elegance defined in every thread.
            </p>
            <div className="flex items-center space-x-5">
              <a href="mailto:alterraszn@gmail.com" className="text-slate-400 hover:text-white transition-colors" title="Gmail">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@alterra.official?_r=1&_ZS-94RDQyPzcUE" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.44-.24-.16-.48-.34-.7-.52v7.21c.01 3.58-1.9 6.75-5.3 7.89-1.39.46-2.9.54-4.32.25-3.05-.62-5.39-3.32-5.74-6.39-.41-3.66 1.88-7.23 5.42-8.31.25-.07.51-.12.78-.15v4.03c-.11.02-.22.05-.33.09-1.9.62-3.02 2.65-2.61 4.61.32 1.53 1.51 2.82 3.03 3.19.86.21 1.78.11 2.58-.25 1.11-.5 1.83-1.61 1.82-2.82V.02z" />
                </svg>
              </a>
              <a href="https://x.com/alterraszn?s=11" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://snapchat.com/t/Gh7wXpDR" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors font-bold text-sm tracking-wider px-0.5" title="Snapchat">
                S
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-8">Shop Selection</h4>
            <ul className="space-y-4">
              <li><button onClick={handleNavToProducts} className="text-slate-400 hover:text-white text-sm transition-colors">All Products</button></li>
              <li><button onClick={handleNavToProducts} className="text-slate-400 hover:text-white text-sm transition-colors">New Arrivals</button></li>
              <li><button onClick={handleNavToProducts} className="text-slate-400 hover:text-white text-sm transition-colors">Bestsellers</button></li>
              <li><button onClick={handleNavToProducts} className="text-slate-400 hover:text-white text-sm transition-colors">Exclusive Collections</button></li>
            </ul>
          </div>

          <div className="md:col-span-2 mt-8 md:mt-0 pt-12 border-t border-white/5">
                <h4 className="text-white font-bold uppercase tracking-wider text-[10px] mb-4 opacity-50 underline decoration-slate-700 underline-offset-4">Legal & Policy</h4>
                <p className="text-slate-500 text-[11px] italic leading-relaxed max-w-2xl">
                    <span className="text-amber-500/80 font-bold not-italic uppercase tracking-widest mr-2">No Refund Policy:</span>
                    At ALTERRA STUDIO, every piece is prepared with meticulous care. Due to the exclusive and bespoke nature of our items, we maintain a strict **No Refund Policy**. Please ensure you check your size and color selections before completing your order.
                </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-[9px] uppercase tracking-[0.2em] font-black">
            © 2026 ALTERRA CLOTHING BRAND. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}

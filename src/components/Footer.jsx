import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Music, Ghost } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <a href="https://snapchat.com/t/Gh7wXpDR" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Snapchat">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                  <path d="M15.943 11.526c-.111-.303-.323-.465-.564-.599a1.416 1.416 0 0 0-.123-.064l-.219-.111c-.752-.399-1.339-.902-1.746-1.498a3.387 3.387 0 0 1-.3-.531c-.034-.1-.032-.156-.008-.207a.338.338 0 0 1 .097-.1.129-.086.262-.173.352-.231.162-.104.289-.187.371-.245.309-.216.525-.446.66-.702a1.397 1.397 0 0 0 .069-1.16c-.205-.538-.713-.872-1.329-.872a1.829 1.829 0 0 0-.487.065c.006-.368-.002-.757-.035-1.139-.116-1.344-.587-2.048-1.077-2.61a4.294 4.294 0 0 0-1.095-.881C9.764.216 8.92 0 7.999 0c-.92 0-1.76.216-2.505.641-.412.232-.782.53-1.097.883-.49.562-.96 1.267-1.077 2.61-.033.382-.04.772-.036 1.138a1.83 1.83 0 0 0-.487-.065c-.615 0-1.124.335-1.328.873a1.398 1.398 0 0 0 .067 1.161c.136.256.352.486.66.701.082.058.21.14.371.246l.339.221a.38.38 0 0 1 .109.11c.026.053.027.11-.012.217a3.363 3.363 0 0 1-.295.52c-.398.583-.968 1.077-1.696 1.472-.385.204-.786.34-.955.8-.128.348-.044.743.28 1.075.119.125.257.23.409.31a4.43 4.43 0 0 0 1 .4.66.66 0 0 1 .202.09c.118.104.102.26.259.488.079.118.18.22.296.3.33.229.701.243 1.095.258.355.014.758.03 1.217.18.19.064.389.186.618.328.55.338 1.305.802 2.566.802 1.262 0 2.02-.466 2.576-.806.227-.14.424-.26.609-.321.46-.152.863-.168 1.218-.181.393-.015.764-.03 1.095-.258a1.14 1.14 0 0 0 .336-.368c.114-.192.11-.327.217-.42a.625.625 0 0 1 .19-.087 4.446 4.446 0 0 0 1.014-.404c.16-.087.306-.2.429-.336l.004-.005c.304-.325.38-.709.256-1.047m-1.121.602c-.684.378-1.139.337-1.493.565-.3.193-.122.61-.34.76-.269.186-1.061-.012-2.085.326-.845.279-1.384 1.082-2.903 1.082s-2.045-.801-2.904-1.084c-1.022-.338-1.816-.14-2.084-.325-.218-.15-.041-.568-.341-.761-.354-.228-.809-.187-1.492-.563-.436-.24-.189-.39-.044-.46 2.478-1.199 2.873-3.05 2.89-3.188.022-.166.045-.297-.138-.466-.177-.164-.962-.65-1.18-.802-.36-.252-.52-.503-.402-.812.082-.214.281-.295.49-.295a1 1 0 0 1 0 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-8">Shop Selection</h4>
            <ul className="space-y-4">
              <li><button onClick={scrollToTop} className="text-slate-400 hover:text-white text-sm transition-colors">All Products</button></li>
              <li><button onClick={scrollToTop} className="text-slate-400 hover:text-white text-sm transition-colors">New Arrivals</button></li>
              <li><button onClick={scrollToTop} className="text-slate-400 hover:text-white text-sm transition-colors">Bestsellers</button></li>
              <li><button onClick={scrollToTop} className="text-slate-400 hover:text-white text-sm transition-colors">Exclusive Collections</button></li>
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

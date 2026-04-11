import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Music, Ghost } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-serif font-bold tracking-tighter text-white uppercase italic">
              ALTERRA
            </Link>
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
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.75c-3.17 0-5.75 2.58-5.75 5.75 0 2.29 1.34 4.26 3.28 5.17-.11.08-.2.18-.27.3l-1.32 1.98c-.12.18-.12.41 0 .59.08.13.22.21.37.21h7.48c.15 0 .29-.08.37-.21.12-.18.12-.41 0-.59l-1.32-1.98c-.07-.12-.16-.22-.27-.3 1.94-.91 3.28-2.88 3.28-5.17 0-3.17-2.58-5.75-5.75-5.75zM12 4.25c2.35 0 4.25 1.9 4.25 4.25 0 1.87-1.2 3.46-2.87 4.04-.15.05-.28.16-.35.31l-1.03 1.55-1.03-1.55c-.07-.15-.2-.26-.35-.31-1.67-.58-2.87-2.17-2.87-4.04 0-2.35 1.9-4.25 4.25-4.25zm-5 14.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5h10c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5H7z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-8">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/collection" className="text-slate-400 hover:text-white text-sm transition-colors">All Products</Link></li>
              <li><Link to="/collection" className="text-slate-400 hover:text-white text-sm transition-colors">New Arrivals</Link></li>
              <li><Link to="/collection" className="text-slate-400 hover:text-white text-sm transition-colors">Bestsellers</Link></li>
              <li><Link to="/collection" className="text-slate-400 hover:text-white text-sm transition-colors">Collections</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-medium">
            © 2026 ALTERRA CLOTHING BRAND. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}

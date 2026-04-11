import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, LogOut, Menu, X, Settings, Search } from 'lucide-react';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { cart, setIsCartOpen, searchQuery, setSearchQuery } = useProducts();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Logic for navbar appearance:
  // On home page: transparent/white on scroll
  // On other pages: always show background and black text
  const showWhiteStyle = isHomePage && !isScrolled;
  const headerTextClass = showWhiteStyle ? 'text-white' : 'text-slate-900';
  const headerNavClass = showWhiteStyle ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900';
  const headerBgClass = showWhiteStyle ? 'bg-transparent py-6' : 'bg-white/80 backdrop-blur-lg shadow-sm py-3';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            <span className={`text-2xl sm:text-3xl font-serif font-bold tracking-tighter transition-colors ${headerTextClass}`}>
              ALTERRA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-grow justify-center">
            <Link to="/" className={`text-xs font-bold transition-colors uppercase tracking-[0.2em] ${headerNavClass}`}>Collection</Link>
            {isAdmin && (
              <Link to="/admin" className={`text-xs font-bold transition-colors uppercase tracking-[0.2em] flex items-center gap-1 ${headerNavClass}`}>
                <Settings className="w-4 h-4" /> Dashboard
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="hidden sm:flex items-center relative gap-2">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`rounded-full px-4 py-1.5 text-xs outline-none border transition-colors ${showWhiteStyle
                        ? 'bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50'
                        : 'bg-slate-100 border-transparent focus:border-slate-200 text-slate-900'
                      }`}
                  />
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 transition-all ${showWhiteStyle ? 'text-white hover:opacity-70' : 'text-slate-900 hover:opacity-50'}`}
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {user ? (
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${showWhiteStyle ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${showWhiteStyle ? 'text-white/80' : 'text-slate-700'}`}>{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`p-2 transition-colors ${showWhiteStyle ? 'text-white/50 hover:text-red-400' : 'text-slate-500 hover:text-red-600'}`}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`hidden sm:flex items-center text-[10px] font-bold uppercase tracking-widest transition-all ${showWhiteStyle ? 'text-white hover:opacity-70' : 'text-slate-900 hover:opacity-50'}`}
              >
                Login
              </Link>
            )}

            {/* Cart Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-all active:scale-90 ${showWhiteStyle ? 'text-white hover:opacity-80' : 'text-slate-900 hover:opacity-70'}`}
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute top-1 right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 ${showWhiteStyle
                        ? 'bg-white text-black border-slate-900'
                        : 'bg-slate-900 text-white border-white'
                      }`}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden p-2 ${showWhiteStyle ? 'text-white' : 'text-slate-900'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-6 flex flex-col items-center text-center">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-serif font-medium text-slate-900"
              >
                Collection
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-serif font-medium text-slate-900"
                >
                  Dashboard
                </Link>
              )}
              <div className="h-px w-12 bg-slate-100" />
              {user ? (
                <>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-lg font-bold mb-2">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-600">{user.email}</span>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="text-red-600 font-semibold"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-premium w-full max-w-[200px]"
                >
                  Log In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

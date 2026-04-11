import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProductProvider, useProducts } from './context/ProductContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ShoppingCart from './components/ShoppingCart';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import { useEffect } from 'react';

const ProtectedAdmin = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      window.alert("You are not an admin!");
    }
  }, [user, isAdmin, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

const Toast = () => {
  const { showToast } = useProducts();
  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-24 left-1/2 z-[200] px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl flex items-center gap-3 border border-slate-700"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest">{showToast}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Toast />
            <Header />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdmin>
                      <Admin />
                    </ProtectedAdmin>
                  }
                />
                <Route path="/product/:id" element={<ProductDetails />} />
              </Routes>
            </main>

            <ShoppingCart />
            <Footer />
          </div>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;

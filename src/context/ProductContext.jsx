/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const cached = localStorage.getItem('alterra_products_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem('alterra_products_cache');
  });
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({ logo_url: '', dashboard_header_url: '' });
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async (token) => {
    try {
      const response = await fetch('https://alterra-node.onrender.com/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.data.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };


  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('alterra_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`https://alterra-node.onrender.com/api/products?t=${Date.now()}`);
      const data = await response.json();
      if (response.ok && data.data && Array.isArray(data.data.products)) {
        const sorted = [...data.data.products].sort((a, b) => b._id.localeCompare(a._id));
        setProducts(sorted);
        localStorage.setItem('alterra_products_cache', JSON.stringify(sorted));
      } else {
        if (!localStorage.getItem('alterra_products_cache')) {
          setError(data.message || 'Failed to fetch products');
        }
      }
    } catch {
      if (!localStorage.getItem('alterra_products_cache')) {
        setError('Server error while loading products');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`https://alterra-node.onrender.com/api/settings?t=${Date.now()}`);
        const data = await response.json();
        if (response.ok && data.data) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };

    fetchProducts();
    fetchSettings();
  }, [fetchProducts]);

  // Real-time catalog & price updates via Socket.IO and tab focus
  useEffect(() => {
    const socket = io('https://alterra-node.onrender.com', {
      transports: ['websocket', 'polling']
    });

    socket.on('productUpdated', (updatedProduct) => {
      if (!updatedProduct || !updatedProduct._id) return;
      setProducts((prev) => {
        const exists = prev.some((p) => p._id === updatedProduct._id);
        const nextProducts = exists
          ? prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
          : [updatedProduct, ...prev];
        localStorage.setItem('alterra_products_cache', JSON.stringify(nextProducts));
        return nextProducts;
      });
    });

    socket.on('productCreated', (newProduct) => {
      if (!newProduct || !newProduct._id) return;
      setProducts((prev) => {
        const nextProducts = [newProduct, ...prev.filter((p) => p._id !== newProduct._id)];
        localStorage.setItem('alterra_products_cache', JSON.stringify(nextProducts));
        return nextProducts;
      });
    });

    socket.on('productDeleted', (deletedId) => {
      if (!deletedId) return;
      setProducts((prev) => {
        const nextProducts = prev.filter((p) => p._id !== deletedId);
        localStorage.setItem('alterra_products_cache', JSON.stringify(nextProducts));
        return nextProducts;
      });
    });

    const handleFocus = () => {
      fetchProducts();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      socket.disconnect();
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchProducts]);

  // Automatically sync cart item prices, names, and images whenever product catalog updates
  useEffect(() => {
    if (!products || products.length === 0) return;

    setCart((prevCart) => {
      let hasChanges = false;
      const updatedCart = prevCart.map((item) => {
        const matchingProduct = products.find((p) => p._id === item._id);
        if (matchingProduct) {
          const newPrice = Number(matchingProduct.price);
          const priceChanged = !isNaN(newPrice) && item.price !== newPrice;
          const nameChanged = matchingProduct.name && item.name !== matchingProduct.name;
          const newImg = matchingProduct.images?.[0] || matchingProduct.image;
          const imageChanged = newImg && item.image !== newImg;

          if (priceChanged || nameChanged || imageChanged) {
            hasChanges = true;
            return {
              ...item,
              price: !isNaN(newPrice) ? newPrice : item.price,
              name: matchingProduct.name || item.name,
              images: matchingProduct.images || item.images,
              image: newImg || item.image
            };
          }
        }
        return item;
      });

      if (hasChanges) {
        localStorage.setItem('alterra_cart', JSON.stringify(updatedCart));
        return updatedCart;
      }
      return prevCart;
    });
  }, [products]);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem('alterra_cart', JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = (Array.isArray(products) ? products : []).filter(product => {
    if (!product || !product.name) return false;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const addProduct = async (newProductData, token) => {
    try {
      const response = await fetch('https://alterra-node.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: newProductData // Expecting FormData for image uploads
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(prev => {
          const newProducts = [data.data.product, ...prev];
          localStorage.setItem('alterra_products_cache', JSON.stringify(newProducts));
          return newProducts;
        });
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: 'Error adding product' };
    }
  };

  const deleteProduct = async (productId, token) => {
    try {
      const response = await fetch(`https://alterra-node.onrender.com/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setProducts(prev => {
          const newProducts = prev.filter(p => p._id !== productId);
          localStorage.setItem('alterra_products_cache', JSON.stringify(newProducts));
          return newProducts;
        });
        return { success: true };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  };

  const updateProduct = async (productId, updatedData, token) => {
    try {
      const response = await fetch(`https://alterra-node.onrender.com/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: updatedData // FormData for multi-part update
      });
      const data = await response.json();
      if (response.ok) {
        const updatedProd = data.data.product;
        setProducts(prev => {
          const newProducts = prev.map(p => p._id === productId ? updatedProd : p);
          localStorage.setItem('alterra_products_cache', JSON.stringify(newProducts));
          return newProducts;
        });

        // Immediately sync matching items in bag/cart in current session
        setCart(prevCart => {
          let hasChanges = false;
          const updatedCart = prevCart.map(item => {
            if (item._id === productId && updatedProd.price !== undefined) {
              hasChanges = true;
              return {
                ...item,
                price: Number(updatedProd.price),
                name: updatedProd.name || item.name,
                images: updatedProd.images || item.images,
                image: updatedProd.images?.[0] || updatedProd.image || item.image
              };
            }
            return item;
          });
          if (hasChanges) {
            localStorage.setItem('alterra_cart', JSON.stringify(updatedCart));
            return updatedCart;
          }
          return prevCart;
        });

        return { success: true };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: 'Error updating product' };
    }
  };

  const [showToast, setShowToast] = useState(null);

  const triggerToast = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const addToCart = (product, attributes = {}) => {
    setCart((prev) => {
      const { size = 'M', color = 'Black', waist = '', customNote = '' } = attributes;
      const existing = prev.find((item) =>
        item._id === product._id &&
        item.selectedSize === size &&
        item.selectedColor === color &&
        item.selectedWaist === waist &&
        item.customNote === customNote
      );

      if (existing) {
        return prev.map((item) =>
          (item._id === product._id &&
            item.selectedSize === size &&
            item.selectedColor === color &&
            item.selectedWaist === waist &&
            item.customNote === customNote)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        ...product,
        quantity: 1,
        selectedSize: size,
        selectedColor: color,
        selectedWaist: waist,
        customNote: customNote
      }];
    });
    setIsCartOpen(true);
    triggerToast(`Added ${product.name} to bag`);
  };

  const createOrder = async (orderData, token) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch('https://alterra-node.onrender.com/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, order: data.data.order };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: 'Server error while placing order' };
    }
  };

  const removeFromCart = (productId, attributes = {}) => {
    const { size, color, waist, customNote } = attributes;
    setCart((prev) => prev.filter((item) => {
      if (item._id !== productId) return true;
      return item.selectedSize !== size || item.selectedColor !== color || item.selectedWaist !== waist || item.customNote !== customNote;
    }));
  };

  const updateQuantity = (productId, quantity, attributes = {}) => {
    if (quantity < 1) {
      removeFromCart(productId, attributes);
      return;
    }
    const { size, color, waist, customNote } = attributes;
    setCart((prev) =>
      prev.map((item) => (
        item._id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color &&
        item.selectedWaist === waist &&
        item.customNote === customNote
      ) ? { ...item, quantity } : item)
    );
  };

  const updateCartItemAttributes = (productId, originalAttributes, newAttributes) => {
    const { size: oldSize, color: oldColor, waist: oldWaist, customNote: oldNote } = originalAttributes;
    const { size: newSize, color: newColor, waist: newWaist } = newAttributes;

    setCart((prev) => {
      const itemIndex = prev.findIndex(item =>
        item._id === productId &&
        item.selectedSize === oldSize &&
        item.selectedColor === oldColor &&
        item.selectedWaist === oldWaist &&
        item.customNote === oldNote
      );

      if (itemIndex === -1) return prev;

      const itemToUpdate = prev[itemIndex];

      // Check if an item with the NEW attributes already exists (excluding the one being edited)
      const existingIndex = prev.findIndex((item, idx) =>
        idx !== itemIndex &&
        item._id === productId &&
        item.selectedSize === newSize &&
        item.selectedColor === newColor &&
        item.selectedWaist === newWaist &&
        item.customNote === oldNote
      );

      if (existingIndex !== -1) {
        // Merge with existing
        const updatedCart = [...prev];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + itemToUpdate.quantity
        };
        updatedCart.splice(itemIndex, 1);
        return updatedCart;
      } else {
        // Just update attributes
        return prev.map((item, idx) =>
          idx === itemIndex
            ? { ...item, selectedSize: newSize, selectedColor: newColor, selectedWaist: newWaist }
            : item
        );
      }
    });
  };

  const updateOrderStatus = async (orderId, status, token) => {
    try {
      const response = await fetch(`https://alterra-node.onrender.com/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? data.data.order : o));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: 'Error updating order status' };
    }
  };

  const updateOrderFulfillment = async (orderId, isFulfilled, token) => {
    try {
      const response = await fetch(`https://alterra-node.onrender.com/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isFulfilled })
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? data.data.order : o));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: 'Error updating order fulfillment' };
    }
  };

  const clearCart = () => {
    localStorage.removeItem('alterra_cart');
    setCart([]);
    setIsCartOpen(false);
    console.log('ProductContext: Cart explicitly cleared from state and storage');
  }

  const value = {
    products,
    fetchProducts,
    orders,
    fetchOrders,
    updateOrderStatus,
    updateOrderFulfillment,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    settings,
    setSettings,
    cart,
    isCartOpen,
    setIsCartOpen,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    createOrder,
    removeFromCart,
    updateQuantity,
    updateCartItemAttributes,
    clearCart,
    showToast,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

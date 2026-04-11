import { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://alterra-node.onrender.com/api/products');
        const data = await response.json();
        if (response.ok && data.data && Array.isArray(data.data.products)) {
          setProducts(data.data.products);
        } else {
          setError(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError('Server error while loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        setProducts(prev => [...prev, data.data.product]);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
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
        setProducts(prev => prev.filter(p => p._id !== productId));
        return { success: true };
      }
      return { success: false };
    } catch (err) {
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
        setProducts(prev => prev.map(p => p._id === productId ? data.data.product : p));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
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
      const { size = 'M', color = 'Black', customNote = '' } = attributes;
      const existing = prev.find((item) =>
        item._id === product._id &&
        item.selectedSize === size &&
        item.selectedColor === color &&
        item.customNote === customNote
      );

      if (existing) {
        return prev.map((item) =>
          (item._id === product._id &&
            item.selectedSize === size &&
            item.selectedColor === color &&
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
        customNote: customNote
      }];
    });
    setIsCartOpen(true);
    triggerToast(`Added ${product.name} to bag`);
  };

  const createOrder = async (orderData) => {
    try {
      const response = await fetch('https://alterra-node.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, order: data.data.order };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Server error while placing order' };
    }
  };

  const removeFromCart = (productId, attributes = {}) => {
    const { size, color, customNote } = attributes;
    setCart((prev) => prev.filter((item) => {
      if (item._id !== productId) return true;
      return item.selectedSize !== size || item.selectedColor !== color || item.customNote !== customNote;
    }));
  };

  const updateQuantity = (productId, quantity, attributes = {}) => {
    if (quantity < 1) {
      removeFromCart(productId, attributes);
      return;
    }
    const { size, color, customNote } = attributes;
    setCart((prev) =>
      prev.map((item) => (
        item._id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color &&
        item.customNote === customNote
      ) ? { ...item, quantity } : item)
    );
  };

  const updateCartItemAttributes = (productId, originalAttributes, newAttributes) => {
    const { size: oldSize, color: oldColor, customNote: oldNote } = originalAttributes;
    const { size: newSize, color: newColor } = newAttributes;

    setCart((prev) => {
      const itemIndex = prev.findIndex(item =>
        item._id === productId &&
        item.selectedSize === oldSize &&
        item.selectedColor === oldColor &&
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
            ? { ...item, selectedSize: newSize, selectedColor: newColor }
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
    } catch (err) {
      return { success: false, message: 'Error updating order status' };
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
    orders,
    fetchOrders,
    updateOrderStatus,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    loading,
    error,
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

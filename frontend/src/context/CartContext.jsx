import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cart';
import { localStorageService } from '../utils/localStorage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadUserCart();
    } else {
      loadGuestCart();
    }
  }, [isAuthenticated, user]);

  const loadUserCart = async () => {
    try {
      setLoading(true);
      const cart = await cartService.getCart();
      setCartItems(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGuestCart = () => {
    const guestCart = localStorageService.getGuestCart();
    setCartItems(guestCart);
  };

  const saveGuestCart = (cart) => {
    localStorageService.setGuestCart(cart);
  };

  const addToCart = async (product, size, quantity = 1) => {
    try {
      if (isAuthenticated) {
        await cartService.addToCart(product._id, size, quantity);
        await loadUserCart();
      } else {
        const newItem = {
          _id: Date.now().toString(),
          product,
          size,
          quantity,
        };
        
        const existingItemIndex = cartItems.findIndex(
          item => item.product._id === product._id && item.size === size
        );

        let newCart;
        if (existingItemIndex > -1) {
          newCart = [...cartItems];
          newCart[existingItemIndex].quantity += quantity;
        } else {
          newCart = [...cartItems, newItem];
        }

        setCartItems(newCart);
        saveGuestCart(newCart);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add to cart' 
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      if (isAuthenticated) {
        await cartService.updateCartItem(itemId, quantity);
        await loadUserCart();
      } else {
        const newCart = cartItems.map(item => 
          item._id === itemId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0);
        
        setCartItems(newCart);
        saveGuestCart(newCart);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cart' 
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        await cartService.removeFromCart(itemId);
        await loadUserCart();
      } else {
        const newCart = cartItems.filter(item => item._id !== itemId);
        setCartItems(newCart);
        saveGuestCart(newCart);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove from cart' 
      };
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartService.clearCart();
        await loadUserCart();
      } else {
        setCartItems([]);
        saveGuestCart([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    refreshCart: isAuthenticated ? loadUserCart : loadGuestCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
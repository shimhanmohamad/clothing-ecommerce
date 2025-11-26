import api from './api';

export const cartService = {
  /**
   * Get user's cart
   */
  getCart: () => 
    api.get('/cart').then(res => res.data),

  /**
   * Add item to cart
   */
  addToCart: (productId, size, quantity = 1) => 
    api.post('/cart', { productId, size, quantity }).then(res => res.data),

  /**
   * Update cart item quantity
   */
  updateCartItem: (itemId, quantity) => 
    api.put(`/cart/${itemId}`, { quantity }).then(res => res.data),

  /**
   * Remove item from cart
   */
  removeFromCart: (itemId) => 
    api.delete(`/cart/${itemId}`).then(res => res.data),

  /**
   * Clear entire cart
   */
  clearCart: () => 
    api.delete('/cart').then(res => res.data),

  /**
   * Merge guest cart with user cart after login
   */
  mergeCart: async (guestCart) => {
    const mergePromises = guestCart.map(item =>
      cartService.addToCart(item.product._id, item.size, item.quantity)
    );
    
    await Promise.all(mergePromises);
    return cartService.getCart();
  },

  /**
   * Get cart summary (total items, total price)
   */
  getCartSummary: async () => {
    const cart = await cartService.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return {
      totalItems,
      totalPrice,
      items: cart
    };
  }
};
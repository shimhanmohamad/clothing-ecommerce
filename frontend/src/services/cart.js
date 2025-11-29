import api from './api';

export const cartService = {
 
  getCart: () => 
    api.get('/cart').then(res => res.data),

  
  addToCart: (productId, size, quantity = 1) => 
    api.post('/cart', { productId, size, quantity }).then(res => res.data),

 
  updateCartItem: (itemId, quantity) => 
    api.put(`/cart/${itemId}`, { quantity }).then(res => res.data),

  
  removeFromCart: (itemId) => 
    api.delete(`/cart/${itemId}`).then(res => res.data),

  
  clearCart: () => 
    api.delete('/cart').then(res => res.data),

  
  mergeCart: async (guestCart) => {
    const mergePromises = guestCart.map(item =>
      cartService.addToCart(item.product._id, item.size, item.quantity)
    );
    
    await Promise.all(mergePromises);
    return cartService.getCart();
  },

 
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
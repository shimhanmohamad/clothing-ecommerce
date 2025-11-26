import api from './api';

export const ordersService = {
  /**
   * Create new order
   */
  createOrder: (orderData) => 
    api.post('/orders', orderData).then(res => res.data),

  /**
   * Get user's orders
   */
  getOrders: (params = {}) => 
    api.get('/orders', { params }).then(res => res.data),

  /**
   * Get single order by ID
   */
  getOrder: (id) => 
    api.get(`/orders/${id}`).then(res => res.data),

  /**
   * Get order by order ID (public identifier)
   */
  getOrderByOrderId: (orderId) => 
    api.get(`/orders/order/${orderId}`).then(res => res.data),

  /**
   * Update order status (admin only)
   */
  updateOrderStatus: (id, status) => 
    api.patch(`/orders/${id}/status`, { status }).then(res => res.data),

  /**
   * Cancel order
   */
  cancelOrder: (id) => 
    api.post(`/orders/${id}/cancel`).then(res => res.data),

  /**
   * Get order statistics for dashboard
   */
  getOrderStats: () => 
    api.get('/orders/stats').then(res => res.data),

  /**
   * Get recent orders
   */
  getRecentOrders: (limit = 5) => 
    api.get('/orders', { params: { limit, sort: '-orderDate' } }).then(res => res.data),

  /**
   * Track order shipment
   */
  trackOrder: (orderId) => 
    api.get(`/orders/${orderId}/track`).then(res => res.data)
};
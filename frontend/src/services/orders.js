import api from './api';

export const ordersService = {
  
  createOrder: (orderData) => 
    api.post('/orders', orderData).then(res => res.data),

 
  getOrders: (params = {}) => 
    api.get('/orders', { params }).then(res => res.data),

 
  getOrder: (id) => 
    api.get(`/orders/${id}`).then(res => res.data),

 
  getOrderByOrderId: (orderId) => 
    api.get(`/orders/order/${orderId}`).then(res => res.data),

 
  updateOrderStatus: (id, status) => 
    api.patch(`/orders/${id}/status`, { status }).then(res => res.data),

 
  cancelOrder: (id) => 
    api.post(`/orders/${id}/cancel`).then(res => res.data),

  
  getOrderStats: () => 
    api.get('/orders/stats').then(res => res.data),

  getRecentOrders: (limit = 5) => 
    api.get('/orders', { params: { limit, sort: '-orderDate' } }).then(res => res.data),

 
  trackOrder: (orderId) => 
    api.get(`/orders/${orderId}/track`).then(res => res.data)
};
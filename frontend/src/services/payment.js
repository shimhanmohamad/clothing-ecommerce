// services/payment.js
import api from './api';

export const paymentService = {
  createCheckoutSession: (shippingAddress) =>
    api.post('/payments/create-checkout-session', { shippingAddress })
      .then(res => res.data)
      .catch(error => {
        console.error('Create checkout session error:', error);
        throw error;
      }),

  completeCheckout: (sessionId) =>
    api.post('/payments/complete-checkout', { session_id: sessionId })
      .then(res => res.data)
      .catch(error => {
        console.error('Complete checkout error:', error);
        throw error;
      }),

  getPaymentStatus: (sessionId) =>
    api.get(`/payments/status/${sessionId}`)
      .then(res => res.data)
      .catch(error => {
        console.error('Get payment status error:', error);
        throw error;
      }),
};
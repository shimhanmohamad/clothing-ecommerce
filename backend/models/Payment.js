// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  stripeSessionId: {
    type: String,
    required: true,
    unique: true
  },
  stripePaymentIntent: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'card'
  },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  }
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ stripeSessionId: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
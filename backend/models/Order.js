const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    size: {
      type: String,
      required: true,
      enum: ['S', 'M', 'L', 'XL']
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered'],
    default: 'confirmed'
  }
});

// Ensure orderId is generated before validation so `required: true` passes
// Use a synchronous pre-validate hook (no `next` callback) so Mongoose
// will treat it as synchronous and not expect a callback.
orderSchema.pre('validate', function() {
  if (!this.orderId) {
    this.orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
});

module.exports = mongoose.model('Order', orderSchema);
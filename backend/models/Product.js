const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Kids']
  },
  sizes: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL'],
    required: true
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
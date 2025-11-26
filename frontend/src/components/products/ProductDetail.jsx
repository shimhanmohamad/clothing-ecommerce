import React from 'react';
import { formatPrice } from '../../utils/helpers';

const ProductDetail = ({ product, selectedSize, onSizeChange, quantity, onQuantityChange, onAddToCart }) => {
  return (
    <div className="space-y-6">
      <div>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          product.category === 'Men' ? 'bg-blue-100 text-blue-800' :
          product.category === 'Women' ? 'bg-pink-100 text-pink-800' :
          'bg-green-100 text-green-800'
        }`}>
          {product.category}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
        <p className="text-3xl font-bold text-primary-600 mt-2">
          {formatPrice(product.price)}
        </p>
      </div>
      
      <p className="text-gray-600 leading-relaxed">{product.description}</p>
      
      {/* Size Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map(size => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`px-6 py-3 border-2 rounded-lg font-medium transition-colors ${
                selectedSize === size
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-primary-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      {/* Quantity Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">-</span>
            </button>
            <span className="w-12 text-center text-xl font-medium">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">+</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <button
        onClick={onAddToCart}
        disabled={!selectedSize}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add to Cart
      </button>

      {/* Product Features */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Premium quality materials
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Available in multiple sizes
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Free shipping on orders over $50
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetail;
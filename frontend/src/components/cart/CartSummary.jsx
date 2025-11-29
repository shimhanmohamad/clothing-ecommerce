import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';

const CartSummary = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5.99 : 0; // Fixed shipping cost
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {isAuthenticated ? (
        <Link
          to="/checkout"
          className="w-full btn-primary text-center block"
        >
          Proceed to Checkout
        </Link>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center">
            Please login to proceed with checkout
          </p>
          <Link
            to="/login"
            className="w-full btn-primary text-center block"
          >
            Login to Checkout
          </Link>
        </div>
      )}

      <Link
        to="/products"
        className="w-full btn-outline text-center block mt-3"
      >
        Continue Shopping
      </Link>

      {cartItems.length > 0 && (
        <button
          onClick={clearCart}
          className="w-full text-red-500 hover:text-red-700 font-medium py-2 mt-4 transition-colors"
        >
          Clear Cart
        </button>
      )}
    </div>
  );
};

export default CartSummary;
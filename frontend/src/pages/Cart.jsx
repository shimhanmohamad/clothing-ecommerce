import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Cart = () => {
  const { cartItems, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full animate-fadeIn">
          <div className="text-6xl mb-6 animate-bounce">🛒</div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Your Cart is Empty
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Looks like you haven't added anything yet.  
            Explore our products and find something you love.
          </p>

          <Link
            to="/products"
            className="btn-primary px-10 py-3 inline-block text-lg rounded-xl shadow hover:shadow-lg transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">

        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg divide-y">
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>

            <Link
              to="/products"
              className="inline-block text-primary-600 hover:text-primary-800 duration-200 font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <CartSummary />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;

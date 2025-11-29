// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { paymentService } from "../services/payment";
import { formatPrice } from "../utils/helpers";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    country: "Sri Lanka",
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

      if (!stripe) {
        toast.error("Stripe failed to load.");
        return;
      }

      // Call backend to create Checkout Session
      const res = await paymentService.createCheckoutSession(shippingAddress);

      if (!res?.url) {
        toast.error("Failed to create payment session.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = res.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Your cart is empty
          </h1>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Shipping Information
              </h2>

              <form onSubmit={handlePayment} className="space-y-5">
                {["name", "address", "city", "postalCode", "country"].map(
                  (field) => (
                    <div key={field}>
                      <label className="text-sm font-medium text-gray-700">
                        {field === "name"
                          ? "Full Name"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={shippingAddress[field]}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black"
                      />
                    </div>
                  )
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {loading
                    ? "Redirecting to Stripe..."
                    : `Pay ${formatPrice(total)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 sticky top-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center pb-4 border-b"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
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
                <div className="flex justify-between text-xl font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-black">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

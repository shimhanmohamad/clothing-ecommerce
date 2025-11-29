// Updated CheckoutSuccess.jsx - Fixed retry logic
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { paymentService } from "../services/payment";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processPayment = async () => {
      const sessionId = new URLSearchParams(location.search).get("session_id");
      
      if (!sessionId) {
        toast.error("Invalid session. Redirecting to checkout.");
        navigate("/checkout");
        return;
      }

      try {
        console.log("🔄 Processing payment completion for session:", sessionId);
        
        // Complete checkout in one call
        const result = await paymentService.completeCheckout(sessionId);
        console.log("✅ Checkout completed successfully:", result);
        
        // Clear cart on frontend
        clearCart();
        setOrder(result.order);
        setLoading(false);
        
        toast.success("🎉 Payment successful! Your order has been placed.");
        
      } catch (err) {
        console.error("❌ Checkout completion error:", err);
        
        const errorMessage = err?.response?.data?.message || 
                           err?.message || 
                           "Payment verification failed. Please check your orders page.";
        
        if (err.response?.status === 409 || err.response?.data?.order) {
          // Order already exists or was created
          clearCart();
          setOrder(err.response.data.order);
          setLoading(false);
          toast.success("🎉 Payment successful! Your order has been placed.");
        } else {
          toast.error(errorMessage);
          setTimeout(() => {
            navigate("/orders");
          }, 3000);
        }
      }
    };

    processPayment();
  }, [location.search, navigate, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Finalizing your order...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we process your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order{user?.name && `, ${user.name}`}. 
            A confirmation email has been sent to {user?.email}.
          </p>
        </div>

        {order && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
            <p className="text-sm text-gray-600">
              Order #: <span className="font-mono">{order._id?.slice(-8)}</span>
            </p>
            <p className="text-sm text-gray-600">
              Total: ${order.totalAmount?.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Status: <span className="text-green-600 font-medium">Confirmed</span>
            </p>
          </div>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
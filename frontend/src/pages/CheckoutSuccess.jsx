// src/pages/CheckoutSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { paymentService } from "../services/payment";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, cartItems } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const processPayment = async () => {
      const sessionId = new URLSearchParams(location.search).get("session_id");
      
      if (!sessionId) {
        toast.error("Invalid session. Redirecting to checkout.");
        navigate("/checkout");
        return;
      }

      try {
        console.log("🔄 Starting payment verification for session:", sessionId);
        
        // Try to get payment status first
        try {
          const paymentStatus = await paymentService.getPaymentStatus(sessionId);
          console.log("✅ Payment status:", paymentStatus);
          
          if (paymentStatus.status === 'paid') {
            // Payment already processed
            await handleSuccess(paymentStatus.order);
            return;
          }
        } catch (statusError) {
          console.warn("⚠️ Could not get payment status, proceeding with completion:", statusError.message);
          // Continue with completion flow
        }

        // Complete checkout
        console.log("🔄 Completing checkout...");
        const result = await paymentService.completeCheckout(sessionId);
        console.log("✅ Checkout completed:", result);
        
        await handleSuccess(result.order);
        
      } catch (err) {
        console.error("❌ Checkout completion error:", err);
        
        // Retry logic for network errors
        if (err.message.includes('Network') && retryCount < 3) {
          const newRetryCount = retryCount + 1;
          setRetryCount(newRetryCount);
          toast.warning(`Retrying... Attempt ${newRetryCount}/3`);
          
          setTimeout(() => {
            processPayment();
          }, 2000 * newRetryCount);
          return;
        }

        const errorMessage = err?.response?.data?.message || 
                           err?.message || 
                           "Payment verification failed. Please check your orders page.";
        
        toast.error(errorMessage);
        
        // If we have an order but there was an error in the process
        if (err?.response?.data?.order) {
          await handleSuccess(err.response.data.order);
        } else {
          // Redirect to orders page anyway - payment might have succeeded
          setTimeout(() => {
            navigate("/orders");
          }, 3000);
        }
      }
    };

    const handleSuccess = async (orderData) => {
      try {
        // Clear cart only if we have items
        if (cartItems.length > 0) {
          clearCart();
        }
        
        setOrder(orderData);
        setLoading(false);
        
        toast.success("🎉 Payment successful! Your order has been placed.");
        
      } catch (clearError) {
        console.warn("⚠️ Could not clear cart:", clearError);
        // Continue anyway - order was created
        setOrder(orderData);
        setLoading(false);
        toast.success("🎉 Payment successful! Your order has been placed.");
      }
    };

    processPayment();
  }, [location.search, navigate, clearCart, retryCount, cartItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Processing your payment...</p>
          <p className="text-sm text-gray-500 mt-2">
            {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Please wait...'}
          </p>
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
            {user?.email && ` A confirmation has been sent to ${user.email}.`}
          </p>
        </div>

        {order && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
            <p className="text-sm text-gray-600">
              Order #: <span className="font-mono">{order._id?.slice(-8) || 'N/A'}</span>
            </p>
            <p className="text-sm text-gray-600">
              Total: ${order.totalAmount?.toFixed(2) || '0.00'}
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
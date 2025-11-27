import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const AddToCartButton = ({ product, size, quantity = 1, className = "" }) => {
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }

    setLoading(true);
    const result = await addToCart(product, size, quantity);
    
    if (result.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(result.message || 'Failed to add to cart');
    }
    setLoading(false);
  };

  return (
   <div className="border-t pt-6">
  <button
    onClick={handleAddToCart}
    disabled={loading || !size}
    className={`w-full bg-black hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className} ${
      loading ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {loading ? 'Adding...' : 'Add to Cart'}
  </button>
</div>
  );
};

export default AddToCartButton;
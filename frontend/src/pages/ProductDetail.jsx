import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productsService } from '../services/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const productData = await productsService.getProduct(id);
      setProduct(productData);

      if (productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const result = await addToCart(product, selectedSize, quantity);

    if (result.success) {
      toast.success('Product added to cart!');
    } else {
      toast.error(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-primary-600">Products</Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left — Product Image */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Right — Product Info */}
          <div className="flex flex-col space-y-6">

            {/* Category Badge + Title + Price */}
            <div>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium tracking-wide ${
                  product.category === 'Men'
                    ? 'bg-blue-100 text-blue-700'
                    : product.category === 'Women'
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {product.category}
              </span>

              <h1 className="text-4xl font-bold text-gray-900 mt-3 tracking-tight">
                {product.name}
              </h1>

              <p className="text-3xl font-bold text-primary-600 mt-3">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Size Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2.5 rounded-xl font-medium border transition-all text-sm ${
                      selectedSize === size
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'border-gray-300 text-gray-700 hover:border-black hover:bg-gray-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 rounded-full border flex items-center justify-center border-gray-400 hover:bg-gray-100 text-lg transition"
                >
                  –
                </button>

                <span className="w-12 text-center text-xl font-semibold">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 rounded-full border flex items-center justify-center border-gray-400 hover:bg-gray-100 text-lg transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full bg-black text-white font-semibold py-4 rounded-xl text-lg hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why You’ll Love It</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✔</span> Premium quality materials
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✔</span> Available in multiple sizes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✔</span> Free shipping on orders over $50
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

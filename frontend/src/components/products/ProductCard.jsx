import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  return (
    <div className="card group hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.category === 'Men' ? 'bg-blue-100 text-blue-800' :
              product.category === 'Women' ? 'bg-pink-100 text-pink-800' :
              'bg-green-100 text-green-800'
            }`}>
              {product.category}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
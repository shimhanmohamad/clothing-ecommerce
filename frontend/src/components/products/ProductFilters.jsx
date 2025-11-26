import React from 'react';
import { productsService } from '../../services/products';

const ProductFilters = ({ filters, onFilterChange, categories }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value, page: 1 });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      size: '',
      minPrice: '',
      maxPrice: '',
      page: 1
    });
  };

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: 1000 }
  ];

  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="form-label">Search</label>
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="input-field"
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="form-label">Category</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="input-field"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div className="mb-6">
        <label className="form-label">Size</label>
        <div className="grid grid-cols-2 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
              className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                filters.size === size
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="form-label">Price Range</label>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handleFilterChange('minPrice', range.min)}
              className={`block w-full text-left py-2 px-3 text-sm rounded-lg border transition-colors ${
                filters.minPrice == range.min
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Price Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label text-sm">Min Price</label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="form-label text-sm">Max Price</label>
          <input
            type="number"
            placeholder="1000"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="input-field text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
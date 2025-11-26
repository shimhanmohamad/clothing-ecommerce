import api from './api';

export const productsService = {
  /**
   * Get all products with optional filters and pagination
   */
  getProducts: (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 12,
      ...params
    };

    const queryParams = Object.fromEntries(
      Object.entries(defaultParams).filter(([_, value]) => value !== undefined && value !== '')
    );

    return api.get('/products', { params: queryParams }).then(res => res.data);
  },

  /**
   * Get single product by ID
   */
  getProduct: (id) => 
    api.get(`/products/${id}`).then(res => res.data),

  /**
   * Get featured products
   */
  getFeaturedProducts: (limit = 8) => 
    api.get('/products', { params: { featured: true, limit } }).then(res => res.data),

  /**
   * Get products by category
   */
  getProductsByCategory: (category, params = {}) => 
    api.get('/products', { params: { category, ...params } }).then(res => res.data),

  /**
   * Search products
   */
  searchProducts: (query, params = {}) => 
    api.get('/products', { params: { search: query, ...params } }).then(res => res.data),

  /**
   * Get all available categories
   */
  getCategories: () => 
    api.get('/products/meta/categories').then(res => res.data),

  /**
   * Get related products
   */
  getRelatedProducts: async (productId, limit = 4) => {
    const product = await productsService.getProduct(productId);
    return api.get('/products', {
      params: {
        category: product.category,
        limit,
        exclude: productId
      }
    }).then(res => res.data);
  },

  /**
   * Create new product (admin only)
   */
  createProduct: (productData) => 
    api.post('/products', productData).then(res => res.data),

  /**
   * Update product (admin only)
   */
  updateProduct: (id, productData) => 
    api.put(`/products/${id}`, productData).then(res => res.data),

  /**
   * Delete product (admin only)
   */
  deleteProduct: (id) => 
    api.delete(`/products/${id}`).then(res => res.data)
};
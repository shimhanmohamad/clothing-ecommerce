import api from './api';

export const productsService = {
  
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

  
  getProduct: (id) => 
    api.get(`/products/${id}`).then(res => res.data),

  
  getFeaturedProducts: (limit = 8) => 
    api.get('/products', { params: { featured: true, limit } }).then(res => res.data),

  
  getProductsByCategory: (category, params = {}) => 
    api.get('/products', { params: { category, ...params } }).then(res => res.data),

  
  searchProducts: (query, params = {}) => 
    api.get('/products', { params: { search: query, ...params } }).then(res => res.data),

  
  getCategories: () => 
    api.get('/products/meta/categories').then(res => res.data),

 
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

  
  createProduct: (productData) => 
    api.post('/products', productData).then(res => res.data),

  
  updateProduct: (id, productData) => 
    api.put(`/products/${id}`, productData).then(res => res.data),

  
  deleteProduct: (id) => 
    api.delete(`/products/${id}`).then(res => res.data)
};
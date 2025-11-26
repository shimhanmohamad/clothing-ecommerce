// Application constants
export const APP_CONSTANTS = {
  // Product categories
  CATEGORIES: {
    MEN: 'Men',
    WOMEN: 'Women',
    KIDS: 'Kids'
  },
  
  // Product sizes
  SIZES: ['S', 'M', 'L', 'XL'],
  
  // Order statuses
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  },
  
  // Price ranges for filters
  PRICE_RANGES: [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: 1000 }
  ],
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100
  },
  
  // Validation limits
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 100,
    PASSWORD_MIN_LENGTH: 6,
    DESCRIPTION_MAX_LENGTH: 1000
  }
};

// Error messages
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    USER_EXISTS: 'User already exists with this email'
  },
  
  // Product errors
  PRODUCT: {
    NOT_FOUND: 'Product not found',
    OUT_OF_STOCK: 'Product is out of stock',
    INVALID_SIZE: 'Invalid size for this product'
  },
  
  // Cart errors
  CART: {
    EMPTY: 'Cart is empty',
    ITEM_NOT_FOUND: 'Cart item not found'
  },
  
  // Order errors
  ORDER: {
    NOT_FOUND: 'Order not found'
  }
};

// Success messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN: 'Login successful',
    REGISTER: 'Registration successful',
    LOGOUT: 'Logout successful'
  },
  CART: {
    ADDED: 'Product added to cart',
    UPDATED: 'Cart updated successfully',
    CLEARED: 'Cart cleared successfully'
  },
  ORDER: {
    CREATED: 'Order placed successfully'
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  GUEST_CART: 'guestCart',
  USER_PREFERENCES: 'userPreferences'
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    PROFILE: '/auth/profile'
  },
  PRODUCTS: {
    BASE: '/products',
    CATEGORIES: '/products/meta/categories'
  },
  CART: {
    BASE: '/cart'
  },
  ORDERS: {
    BASE: '/orders'
  }
};
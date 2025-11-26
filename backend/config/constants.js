// Application constants
const constants = {
  // Product categories
  CATEGORIES: {
    MEN: 'Men',
    WOMEN: 'Women',
    KIDS: 'Kids'
  },
  
  // Product sizes
  SIZES: {
    SMALL: 'S',
    MEDIUM: 'M',
    LARGE: 'L',
    EXTRA_LARGE: 'XL',
    ONE_SIZE: 'One Size'
  },
  
  // Order statuses
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100
  },
  
  // Price ranges for filters
  PRICE_RANGES: {
    MIN: 0,
    MAX: 1000,
    STEPS: [0, 25, 50, 100, 200, 500, 1000]
  },
  
  // Validation limits
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 100,
    PASSWORD_MIN_LENGTH: 6,
    DESCRIPTION_MAX_LENGTH: 1000
  },
  
  // File upload constraints
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_MIME_TYPES: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ]
  }
};

// Error messages
const errorMessages = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
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
    NOT_FOUND: 'Order not found',
    INVALID_STATUS: 'Invalid order status'
  },
  
  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please provide a valid email',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long'
  }
};

// Success messages
const successMessages = {
  AUTH: {
    LOGIN: 'Login successful',
    REGISTER: 'Registration successful',
    LOGOUT: 'Logout successful'
  },
  PRODUCT: {
    CREATED: 'Product created successfully',
    UPDATED: 'Product updated successfully',
    DELETED: 'Product deleted successfully'
  },
  CART: {
    ADDED: 'Product added to cart',
    UPDATED: 'Cart updated successfully',
    CLEARED: 'Cart cleared successfully'
  },
  ORDER: {
    CREATED: 'Order placed successfully',
    UPDATED: 'Order updated successfully'
  }
};

module.exports = {
  constants,
  errorMessages,
  successMessages
};
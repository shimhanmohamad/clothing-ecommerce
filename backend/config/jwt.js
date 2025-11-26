const jwt = require('jsonwebtoken');

const JWT_CONFIG = {
  // JWT secret key - should be in .env file
  secret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
  
  // Token expiration time
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Token issuer
  issuer: process.env.JWT_ISSUER || 'clothing-ecommerce-api',
  
  // Token audience
  audience: process.env.JWT_AUDIENCE || 'clothing-ecommerce-app'
};

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret, {
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Decode token without verification (for inspection)
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  JWT_CONFIG,
  generateToken,
  verifyToken,
  decodeToken
};
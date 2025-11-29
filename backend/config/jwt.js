const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Enhanced JWT configuration with validation
const JWT_CONFIG = {
  // JWT secret key - should be in .env file
  secret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
  
  // Token expiration time
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Token issuer
  issuer: process.env.JWT_ISSUER || 'clothing-ecommerce-api',
  
  // Token audience
  audience: process.env.JWT_AUDIENCE || 'clothing-ecommerce-app',
  
  // Algorithm (explicitly set for security)
  algorithm: 'HS256'
};

// Validate JWT configuration
const validateConfig = () => {
  const errors = [];
  
  if (!JWT_CONFIG.secret || JWT_CONFIG.secret === 'fallback_secret_key_change_in_production') {
    errors.push('JWT_SECRET is using default value. Change this in production!');
  }
  
  if (JWT_CONFIG.secret.length < 32) {
    errors.push('JWT_SECRET should be at least 32 characters long for security');
  }
  
  if (errors.length > 0) {
    console.warn('⚠️ JWT Configuration Warnings:');
    errors.forEach(error => console.warn(`  - ${error}`));
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT configuration validation failed in production');
    }
  }
};

// Call validation on startup
validateConfig();

// Enhanced token payload structure
const createPayload = (userId, additionalData = {}) => {
  return {
    userId,
    type: 'access',
    iat: Math.floor(Date.now() / 1000), // issued at
    ...additionalData
  };
};

// Generate JWT token with enhanced options
const generateToken = (userId, options = {}) => {
  const {
    expiresIn = JWT_CONFIG.expiresIn,
    type = 'access',
    additionalData = {}
  } = options;

  const payload = {
    userId,
    type,
    ...additionalData
  };

  const signOptions = {
    expiresIn,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience,
    algorithm: JWT_CONFIG.algorithm,
    subject: userId.toString()
  };

  return jwt.sign(payload, JWT_CONFIG.secret, signOptions);
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return generateToken(userId, {
    expiresIn: '30d',
    type: 'refresh'
  });
};

// Verify JWT token with enhanced error handling
const verifyToken = (token, options = {}) => {
  try {
    const verifyOptions = {
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience,
      algorithms: [JWT_CONFIG.algorithm],
      ...options
    };

    return jwt.verify(token, JWT_CONFIG.secret, verifyOptions);
  } catch (error) {
    // Enhanced error mapping
    const errorMap = {
      'TokenExpiredError': 'Token has expired',
      'JsonWebTokenError': 'Invalid token',
      'NotBeforeError': 'Token not yet active'
    };

    const errorMessage = errorMap[error.name] || 'Token verification failed';
    
    const verificationError = new Error(errorMessage);
    verificationError.name = error.name;
    verificationError.expiredAt = error.expiredAt;
    
    throw verificationError;
  }
};

// Verify token without throwing (safe verification)
const safeVerify = (token) => {
  try {
    return {
      valid: true,
      payload: verifyToken(token)
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      name: error.name
    };
  }
};

// Decode token without verification (for inspection)
const decodeToken = (token, options = { complete: false }) => {
  return jwt.decode(token, options);
};

// Check if token is about to expire (for refresh logic)
const isTokenExpiringSoon = (token, thresholdMinutes = 15) => {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - now;
    
    return timeUntilExpiry < (thresholdMinutes * 60);
  } catch (error) {
    return false;
  }
};

// Generate token pair (access + refresh)
const generateTokenPair = (userId, additionalData = {}) => {
  return {
    accessToken: generateToken(userId, { additionalData }),
    refreshToken: generateRefreshToken(userId)
  };
};

// Refresh access token using refresh token
const refreshAccessToken = (refreshToken) => {
  try {
    const payload = verifyToken(refreshToken);
    
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type for refresh');
    }

    return generateToken(payload.userId);
  } catch (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }
};

// Utility to extract token from various sources
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  return null;
};

// Generate a secure random secret (for development/initial setup)
const generateSecureSecret = (bytes = 64) => {
  return crypto.randomBytes(bytes).toString('hex');
};

// Token blacklist simulation (in production, use Redis)
const tokenBlacklist = new Set();
const blacklistToken = (token) => {
  const payload = decodeToken(token);
  if (payload && payload.exp) {
    // Store token signature or jti (JWT ID) in production
    tokenBlacklist.add(token);
  }
};

const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

// Enhanced verify that checks blacklist
const verifyTokenWithBlacklist = (token) => {
  if (isTokenBlacklisted(token)) {
    throw new Error('Token has been revoked');
  }
  return verifyToken(token);
};

module.exports = {
  JWT_CONFIG,
  generateToken,
  generateRefreshToken,
  verifyToken,
  safeVerify,
  decodeToken,
  isTokenExpiringSoon,
  generateTokenPair,
  refreshAccessToken,
  extractTokenFromHeader,
  generateSecureSecret,
  blacklistToken,
  isTokenBlacklisted,
  verifyTokenWithBlacklist,
  createPayload,
  validateConfig
};
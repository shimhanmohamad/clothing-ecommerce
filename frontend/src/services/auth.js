import api from './api';

export const authService = {
  /**
   * Login user with email and password
   */
  login: (email, password) => 
    api.post('/auth/login', { email, password }).then(res => res.data),

  /**
   * Register new user
   */
  register: (name, email, password) => 
    api.post('/auth/register', { name, email, password }).then(res => res.data),

  /**
   * Get current user profile
   */
  getCurrentUser: () => 
    api.get('/auth/me').then(res => res.data),

  /**
   * Update user profile
   */
  updateProfile: (userData) => 
    api.put('/auth/profile', userData).then(res => res.data),

  /**
   * Change password
   */
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword }).then(res => res.data),

  /**
   * Request password reset
   */
  forgotPassword: (email) => 
    api.post('/auth/forgot-password', { email }).then(res => res.data),

  /**
   * Reset password with token
   */
  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password', { token, newPassword }).then(res => res.data)
};
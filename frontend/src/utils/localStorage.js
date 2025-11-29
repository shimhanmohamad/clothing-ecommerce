const TOKEN_KEY = 'auth_token';

export const localStorageService = {
  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('❌ Failed to save token to localStorage:', error);
    }
  },

  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('❌ Failed to get token from localStorage:', error);
      return null;
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('❌ Failed to remove token from localStorage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('❌ Failed to clear localStorage:', error);
    }
  },

  // Guest cart management
  setGuestCart: (cart) => {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  },
  getGuestCart: () => {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  },
  clearGuestCart: () => {
    localStorage.removeItem('guestCart');
  },

  // User preferences
  setUserPreferences: (preferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  },
  getUserPreferences: () => {
    const preferences = localStorage.getItem('userPreferences');
    return preferences ? JSON.parse(preferences) : {};
  }
};
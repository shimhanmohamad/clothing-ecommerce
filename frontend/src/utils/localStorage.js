export const localStorageService = {
  // Token management
  setToken: (token) => {
    localStorage.setItem('token', token);
  },
  getToken: () => {
    return localStorage.getItem('token');
  },
  removeToken: () => {
    localStorage.removeItem('token');
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
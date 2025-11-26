export const localStorageService = {
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  setGuestCart: (cart) => {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  },

  getGuestCart: () => {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  },

  clearGuestCart: () => {
    localStorage.removeItem('guestCart');
  }
};
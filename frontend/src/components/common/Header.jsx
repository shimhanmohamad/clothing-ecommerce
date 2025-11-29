import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  // Safe user data extraction
  const getUserData = () => {
    if (!user) return null;
    
    // Handle nested user object (user.user) or direct user object
    return user.user || user;
  };

  const getUserName = () => {
    const userData = getUserData();
    return userData?.name || userData?.email?.split('@')[0] || 'User';
  };

  const getUserInitial = () => {
    const userData = getUserData();
    const name = userData?.name || userData?.email || 'User';
    return name.charAt(0).toUpperCase();
  };

  // Debug logs with proper structure
  console.log('Header - isAuthenticated:', isAuthenticated);
  console.log('Header - raw user:', user);
  console.log('Header - extracted user data:', getUserData());
  console.log('Header - user name:', getUserName());

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
            <span className="text-xl font-bold text-gray-900">FashionStore</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Orders
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Profile
                </Link>
                
                <div className="flex items-center space-x-4">
                  {/* User Avatar with Dropdown */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {getUserInitial()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        Hello, {getUserName()}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Cart - Always visible */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
              </svg>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
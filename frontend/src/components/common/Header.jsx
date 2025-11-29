import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const getUserData = () => (user?.user ? user.user : user || null);

  const getUserName = () => {
    const u = getUserData();
    return u?.name || u?.email?.split("@")[0] || "User";
  };

  const getUserInitial = () => {
    const u = getUserData();
    const name = u?.name || u?.email || "U";
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LEFT – Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
            <span className="text-xl font-bold text-gray-900">FashionStore</span>
          </Link>

          {/* CENTER – Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>

            {isAuthenticated && (
              <>
                <Link to="/orders" className="nav-link">Orders</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
              </>
            )}
          </nav>

          {/* RIGHT – User & Cart */}
          <div className="flex items-center gap-6">

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21"
                />
              </svg>

              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">

                {/* Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {getUserInitial()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Hello, {getUserName()}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="nav-link">Login</Link>

                <Link
                  to="/register"
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
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

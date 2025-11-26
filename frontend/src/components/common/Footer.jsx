import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
              <span className="text-xl font-bold">FashionStore</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Your one-stop destination for the latest fashion trends. Quality clothing for men, women, and kids.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/products" className="text-gray-400 hover:text-white transition-colors">All Products</a></li>
              <li><a href="/products?category=Men" className="text-gray-400 hover:text-white transition-colors">Men's Collection</a></li>
              <li><a href="/products?category=Women" className="text-gray-400 hover:text-white transition-colors">Women's Collection</a></li>
              <li><a href="/products?category=Kids" className="text-gray-400 hover:text-white transition-colors">Kids' Collection</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 FashionStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
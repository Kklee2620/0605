import React from 'react';
import { Link } from 'react-router-dom';
import { RoutePath } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-8 mt-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">ModernStore</h3>
            <p className="text-sm">Your one-stop shop for modern goods.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Shop</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to={RoutePath.Home} className="hover:text-indigo-600">All Products</Link></li>
              {/* You can dynamically list categories here or a few key ones */}
              <li><Link to={`/category/Furniture`} className="hover:text-indigo-600">Furniture</Link></li>
              <li><Link to={`/category/Electronics`} className="hover:text-indigo-600">Electronics</Link></li>
              <li><Link to={`/category/Apparel`} className="hover:text-indigo-600">Apparel</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Information</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to={RoutePath.About} className="hover:text-indigo-600">About Us</Link></li>
              <li><Link to={RoutePath.Contact} className="hover:text-indigo-600">Contact</Link></li>
              <li><Link to={RoutePath.PrivacyPolicy} className="hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link to={RoutePath.ReturnPolicy} className="hover:text-indigo-600">Return Policy</Link></li>
              <li><Link to={RoutePath.ShippingPolicy} className="hover:text-indigo-600">Shipping Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect</h3>
            <p className="text-sm">Follow us on social media! (Links are placeholders)</p>
            <div className="flex justify-center md:justify-start space-x-3 mt-2">
                <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-indigo-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                {/* Add other social icons similarly */}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-300 pt-8 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} ModernStore. All rights reserved.</p>
          <p className="text-xs mt-1">Designed with Passion</p>
        </div>
      </div>
    </footer>
  );
};
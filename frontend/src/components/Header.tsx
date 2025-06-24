
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, SearchIcon } from './icons';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { CartContextType, AuthContextType } from '../types';
import { RoutePath } from '../constants';
import { Button } from './Button';

export const Header: React.FC = () => {
  const { getItemCount } = useContext(CartContext) as CartContextType;
  const { currentUser, logout, loading } = useContext(AuthContext) as AuthContextType;
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const navigate = useNavigate();

  const itemCount = getItemCount();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      navigate(`${RoutePath.SearchResultsPage}?q=${encodeURIComponent(localSearchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(RoutePath.Home);
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to={RoutePath.Home} className="text-2xl font-bold text-indigo-600">
              ModernStore
            </Link>
          </div>

          <div className="hidden md:flex flex-grow max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="block w-full bg-gray-100 border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
              />
               <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-600 hover:text-indigo-800" aria-label="Submit search">
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
          
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link to={RoutePath.Home} className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium hidden sm:block">
              Home
            </Link>
            {currentUser?.role === 'ADMIN' && (
                 <Link to={RoutePath.AdminDashboard} className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium hidden sm:block">
                    Admin Panel
                 </Link>
            )}
            <Link to={RoutePath.Cart} className="relative text-gray-600 hover:text-indigo-600 p-2 rounded-full">
              <ShoppingCartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 block h-5 w-5 transform rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {loading ? (
              <div className="w-6 h-6 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
            ) : currentUser ? (
              <>
                <Link to={RoutePath.Account} className="text-gray-600 hover:text-indigo-600 p-2 rounded-full">
                  <UserIcon className="h-6 w-6" />
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="hidden sm:inline-flex">Logout</Button>
              </>
            ) : (
              <>
                <Button as={Link} to={RoutePath.Login} variant="ghost" size="sm" className="whitespace-nowrap">Login</Button>
                <Button as={Link} to={RoutePath.Register} variant="primary" size="sm" className="whitespace-nowrap hidden sm:inline-flex">Sign Up</Button>
              </>
            )}
          </nav>
        </div>
        <div className="md:hidden py-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="block w-full bg-gray-100 border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
              />
              <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-600 hover:text-indigo-800" aria-label="Submit search">
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
      </div>
    </header>
  );
};


import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../types';
import { Button } from '../components/Button';
import { RoutePath } from '../constants';
import { EyeIcon, EyeSlashIcon } from '../components/icons';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, currentUser, loading: authLoading } = useContext(AuthContext) as AuthContextType;
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || RoutePath.Account;

  useEffect(() => {
    if (currentUser && !authLoading) { // Ensure authLoading is false before redirecting
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      // Navigation is handled by useEffect after currentUser updates
      // setIsSubmitting will be reset implicitly when authLoading becomes true then false, or on error
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      setIsSubmitting(false); 
    }
  };

  if (authLoading && !isSubmitting) { 
    return <div className="min-h-[calc(100vh-128px)] flex items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }
  
  // If user is already set (e.g., from initial token check), and we are not in the middle of a submission, redirect.
  if (currentUser && !isSubmitting) return null; 


  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to={RoutePath.Register} className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || authLoading}
              />
            </div>
            <div className="relative">
              <label htmlFor="password_login" className="sr-only">Password</label>
              <input
                id="password_login"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || authLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isSubmitting || authLoading}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full" 
              isLoading={isSubmitting || authLoading} 
              disabled={isSubmitting || authLoading}
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

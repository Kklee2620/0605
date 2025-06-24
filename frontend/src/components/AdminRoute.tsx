
import React, { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../types';
import { RoutePath } from '../constants';

interface AdminRouteProps {
  children?: JSX.Element; // Allow children for element-based routing or use Outlet
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext) as AuthContextType;
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={RoutePath.Login} state={{ from: location }} replace />;
  }

  if (currentUser.role !== 'ADMIN') {
    // If user is logged in but not an admin, redirect to home or an "access denied" page
    return <Navigate to={RoutePath.Home} replace />; 
  }

  return children ? children : <Outlet />; // Render children or Outlet for nested routes
};

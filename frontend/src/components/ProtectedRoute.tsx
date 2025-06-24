import React, { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Assuming AuthContext is in this path
import { AuthContextType } from '../types'; // Assuming types are here
import { RoutePath } from '../constants'; // Assuming constants are here

interface ProtectedRouteProps {
  children?: JSX.Element; // Allow children for element-based routing or use Outlet
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  // It's possible AuthContext might be undefined if not properly provided up the tree,
  // though App.tsx should ensure this. Handle defensively.
  if (!authContext) {
    console.error("AuthContext is undefined in ProtectedRoute. Ensure AuthProvider wraps the application.");
    // Fallback behavior: redirect to login, as we can't determine auth status.
    return <Navigate to={RoutePath.Login} replace />;
  }

  const { currentUser, loading } = authContext as AuthContextType;
  const location = useLocation();

  if (loading) {
    // Display a loading indicator while checking authentication status
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    // User not logged in, redirect to login page
    // Pass the current location so we can redirect back after login
    return <Navigate to={RoutePath.Login} state={{ from: location }} replace />;
  }

  // User is authenticated, render the children or Outlet for nested routes
  return children ? children : <Outlet />;
};

// Exporting as a named export
export default ProtectedRoute;

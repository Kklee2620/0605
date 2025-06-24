
import React, { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { RoutePath } from '../constants';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../types';
import { Button } from '../components/Button';

// Icons for sidebar
const DashboardIcon: React.FC<{className?: string}> = ({className}) => <svg className={className || "w-5 h-5 mr-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
const ProductIcon: React.FC<{className?: string}> = ({className}) => <svg className={className || "w-5 h-5 mr-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>;
const OrderIcon: React.FC<{className?: string}> = ({className}) => <svg className={className || "w-5 h-5 mr-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5V3a2 2 0 012-2h2a2 2 0 012 2v2m-6 9l2 2 4-4"/></svg>;
const UserIconInternal: React.FC<{className?: string}> = ({className}) => <svg className={className || "w-5 h-5 mr-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3"/></svg>;


export const AdminLayout: React.FC = () => {
  const { currentUser, logout } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(RoutePath.Home);
  };
  
  const adminNavItems = [
    { path: RoutePath.AdminDashboard, label: 'Dashboard', icon: <DashboardIcon /> },
    { path: RoutePath.AdminProducts, label: 'Products', icon: <ProductIcon /> },
    { path: RoutePath.AdminOrders, label: 'Orders', icon: <OrderIcon /> },
    { path: RoutePath.AdminUsers, label: 'Users', icon: <UserIconInternal /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-gray-700">
          <Link to={RoutePath.AdminDashboard} className="text-2xl font-semibold hover:text-indigo-400">Admin Panel</Link>
          {currentUser && <p className="text-xs text-gray-400 mt-1">Logged in as {currentUser.name || currentUser.email}</p>}
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {adminNavItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== RoutePath.AdminDashboard && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {React.cloneElement(item.icon, { className: `w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}` })}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Button onClick={handleLogout} variant="danger" className="w-full mb-2">Logout</Button>
          <Button as={Link} to={RoutePath.Home} variant="secondary" className="w-full text-sm">
            Back to Store
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 overflow-auto ml-64"> {/* Add ml-64 for sidebar offset */}
        <Outlet /> {/* Nested admin routes will render here */}
      </main>
    </div>
  );
};

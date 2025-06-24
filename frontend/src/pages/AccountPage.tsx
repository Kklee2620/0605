
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType, Order, OrderProductItem } from '../types';
import { Button } from '../components/Button';
import { RoutePath } from '../constants';
import { fetchUserOrdersApi } from '../services/orderApiService';

const OrderItemCard: React.FC<{item: OrderProductItem}> = ({ item }) => (
    <div className="flex items-center space-x-3 p-2 border-b last:border-b-0">
        <img 
            src={item.productImageUrl || 'https://via.placeholder.com/50x50.png?text=No+Image'} 
            alt={item.productName} 
            className="w-12 h-12 object-cover rounded" 
        />
        <div>
            <p className="text-sm font-medium text-gray-800">{item.productName}</p>
            <p className="text-xs text-gray-500">Qty: {item.quantity} - ${Number(item.priceAtPurchase).toFixed(2)} each</p>
            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                <p className="text-xs text-gray-500">
                    {Object.entries(item.selectedOptions).map(([key, value]) => `${key}: ${value}`).join(', ')}
                </p>
            )}
        </div>
    </div>
);


const OrderCard: React.FC<{order: Order}> = ({ order }) => (
    <div className="bg-gray-50 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-3 pb-2 border-b">
            <div>
                <p className="font-semibold text-gray-800">Order #{order.id.substring(0,8)}... </p>
                <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-700' :
                order.status.toLowerCase() === 'processing' || order.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                order.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700' // Default for other statuses
            }`}>
                {order.status}
            </span>
        </div>
        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
             {order.items.map(item => <OrderItemCard key={item.id} item={item} />)} {/* item.id is OrderItemID from backend */}
        </div>
        <p className="text-right font-semibold text-gray-800">Total: ${Number(order.totalAmount).toFixed(2)}</p>
    </div>
);


export const AccountPage: React.FC = () => {
  const { currentUser, logout, token, loading: authLoading } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch orders if user is authenticated (token exists) and auth is not loading
    if (!authLoading && currentUser && token) {
      const loadOrders = async () => {
        setLoadingOrders(true);
        setErrorOrders(null);
        try {
          const fetchedOrders = await fetchUserOrdersApi(token);
          setOrders(fetchedOrders);
        } catch (err: any) {
          setErrorOrders(err.message || "Failed to load order history.");
          console.error(err);
        } finally {
          setLoadingOrders(false);
        }
      };
      loadOrders();
    } else if (!authLoading && !currentUser) {
        // If auth loading is done and there's no user, no orders to load
        setLoadingOrders(false);
        setOrders([]); // Clear any old orders
    }
  }, [currentUser, token, authLoading]);

  const handleLogout = () => {
    logout();
    navigate(RoutePath.Home);
  };

  if (authLoading) {
     return <div className="py-8 text-center text-gray-600">Loading account details...</div>;
  }

  if (!currentUser) {
    // This should be handled by ProtectedRoute, which navigates to Login.
    // Returning null here prevents rendering this page if ProtectedRoute somehow fails or before redirect.
    return null; 
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-1">Welcome back, {currentUser.name || currentUser.email}!</p>
            </div>
            <Button onClick={handleLogout} variant="secondary" size="md" className="mt-4 sm:mt-0">
              Logout
            </Button>
          </div>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Details</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">Name:</span> {currentUser.name || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {currentUser.email}</p>
              <p><span className="font-medium">Role:</span> {currentUser.role || 'USER'}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order History</h2>
            {loadingOrders && <p className="text-gray-600">Loading order history...</p>}
            {errorOrders && <p className="text-red-600">{errorOrders}</p>}
            {!loadingOrders && !errorOrders && orders.length > 0 && (
              <div className="space-y-6">
                {orders.map(order => <OrderCard key={order.id} order={order} />)}
              </div>
            )}
            {!loadingOrders && !errorOrders && orders.length === 0 && (
              <p className="text-gray-600">You haven't placed any orders yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

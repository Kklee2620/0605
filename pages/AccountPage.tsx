
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType, Order, OrderProductItem } from '../types'; // Changed CartItem to OrderProductItem here for clarity, though CartItem wasn't directly used by AccountPage itself
import { Button } from '../components/Button';
import { RoutePath, MOCK_ORDERS } from '../constants'; // Using MOCK_ORDERS for demo

const OrderItemCard: React.FC<{item: OrderProductItem}> = ({ item }) => ( // Changed CartItem to OrderProductItem
    <div className="flex items-center space-x-3 p-2 border-b last:border-b-0">
        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" /> {/* Changed item.imageUrls[0] to item.imageUrl */}
        <div>
            <p className="text-sm font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500">Qty: {item.quantity} - ${item.price.toFixed(2)} each</p>
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
                <p className="font-semibold text-gray-800">Order #{order.id}</p>
                <p className="text-sm text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
            }`}>
                {order.status}
            </span>
        </div>
        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
            {order.items.map(item => <OrderItemCard key={`${item.id}-${JSON.stringify(item.selectedOptions || {})}`} item={item} />)} {/* Updated key */}
        </div>
        <p className="text-right font-semibold text-gray-800">Total: ${order.total.toFixed(2)}</p>
    </div>
);


export const AccountPage: React.FC = () => {
  const { currentUser, logout } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  // For demo, filter mock orders. In a real app, this would be fetched.
  const userOrders = MOCK_ORDERS; // Assuming all mock orders belong to the current demo user.

  const handleLogout = () => {
    logout();
    navigate(RoutePath.Home);
  };

  if (!currentUser) {
    // This should ideally be handled by ProtectedRoute, but as a fallback:
    navigate(RoutePath.Login);
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
              {/* Add more details like address, phone etc. later */}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order History</h2>
            {userOrders.length > 0 ? (
              <div className="space-y-6">
                {userOrders.map(order => <OrderCard key={order.id} order={order} />)}
              </div>
            ) : (
              <p className="text-gray-600">You haven't placed any orders yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

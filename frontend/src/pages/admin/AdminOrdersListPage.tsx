
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { AuthContextType, AdminOrderSummary, OrderStatus } from '../../types';
import { fetchAdminOrdersApi } from '../../services/adminOrderApiService';
import { Button } from '../../components/Button';
import { RoutePath } from '../../constants';
import { EyeIcon } from '../../components/icons';
import { PaginationControls } from '../../components/PaginationControls'; // Import PaginationControls

const AdminOrdersListPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AuthContext) as AuthContextType;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); 
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const loadOrders = useCallback(async (page: number, search: string, status: OrderStatus | 'ALL') => {
    if (!token) {
      setError("Authentication required.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (status !== 'ALL') params.status = status;
      
      const response = await fetchAdminOrdersApi(params, token);
      setOrders(response.data);
      setTotalPages(Math.ceil(response.total / response.limit)); // Calculate total pages
      setCurrentPage(response.page); // Set current page from API response
    } catch (err: any) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [token, limit]);

  useEffect(() => {
    loadOrders(currentPage, searchTerm, statusFilter);
  }, [loadOrders, currentPage, searchTerm, statusFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as OrderStatus | 'ALL');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage); // PaginationControls will ensure newPage is valid
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROCESSING: return 'bg-blue-100 text-blue-800';
      case OrderStatus.SHIPPED: return 'bg-teal-100 text-teal-800';
      case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  if (loading && orders.length === 0) return <div className="text-center p-4">Loading orders...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Orders</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search-order" className="block text-sm font-medium text-gray-700">Search Orders</label>
          <input
            type="text"
            id="search-order"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Order ID, Customer..."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 bg-white"
          >
            <option value="ALL">All Statuses</option>
            {Object.values(OrderStatus).map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800">
                     <Link to={RoutePath.AdminOrderDetail.replace(':orderId', order.id)}>{order.id.substring(0,8)}...</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.user.name || order.user.email}
                    <div className="text-xs text-gray-500">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{order.itemCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      as={Link} 
                      to={RoutePath.AdminOrderDetail.replace(':orderId', order.id)} 
                      variant="ghost" 
                      size="sm" 
                      className="text-indigo-600 hover:text-indigo-900"
                      title="View Order Details"
                    >
                      <EyeIcon />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-6"
        />
      )}
    </div>
  );
};

export default AdminOrdersListPage;

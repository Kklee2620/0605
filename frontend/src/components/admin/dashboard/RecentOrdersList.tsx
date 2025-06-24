import React, { useEffect, useState } from 'react';
import { adminDashboardApiService, RecentOrder } from '../../../services/adminDashboardApiService';
import { Link } from 'react-router-dom';

interface RecentOrdersListProps {
  limit?: number;
}

const RecentOrdersList: React.FC<RecentOrdersListProps> = ({ limit = 5 }) => {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        const data = await adminDashboardApiService.getRecentOrders(limit);
        setOrders(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách đơn hàng mới nhất');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, [limit]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'SHIPPED':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Đã giao hàng';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-4 border-b border-gray-100">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
        <p>{error}</p>
        <button 
          className="mt-2 text-sm underline"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Đơn hàng mới nhất</h2>
        <Link
          to="/admin/orders"
          className="text-sm text-blue-600 hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có đơn hàng nào
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <div key={order.id} className="py-4">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Đơn hàng #{order.id.slice(0, 8)}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="text-sm mt-1">
                    {order.user.firstName} {order.user.lastName} ({order.user.email})
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getStatusBadgeClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center text-sm text-gray-600">
                    <div className="w-6 h-6 rounded overflow-hidden bg-gray-100 mr-2">
                      {item.product.imageUrls && item.product.imageUrls.length > 0 ? (
                        <img
                          src={item.product.imageUrls[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                    <span className="truncate max-w-[150px]">
                      {item.quantity}x {item.product.name}
                    </span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="text-xs text-gray-500 self-end">
                    +{order.items.length - 3} sản phẩm khác
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrdersList; 
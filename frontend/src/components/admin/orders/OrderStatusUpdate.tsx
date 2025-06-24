import React, { useState } from 'react';
import { adminOrderApiService } from '../../../services/adminOrderApiService';

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdated: (newStatus: string) => void;
}

const OrderStatusUpdate: React.FC<OrderStatusUpdateProps> = ({
  orderId,
  currentStatus,
  onStatusUpdated,
}) => {
  const [status, setStatus] = useState<string>(currentStatus);
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PROCESSING', label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
    { value: 'SHIPPED', label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
    { value: 'DELIVERED', label: 'Đã giao hàng', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  ];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setSuccess(false);
  };

  const handleEmailToggle = () => {
    setSendEmail(!sendEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === currentStatus) {
      setError('Vui lòng chọn trạng thái khác với trạng thái hiện tại');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await adminOrderApiService.updateOrderStatus(orderId, status, sendEmail);
      
      setSuccess(true);
      onStatusUpdated(status);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (statusValue: string) => {
    const option = statusOptions.find(opt => opt.value === statusValue);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (statusValue: string) => {
    const option = statusOptions.find(opt => opt.value === statusValue);
    return option ? option.label : statusValue;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Cập nhật trạng thái</h3>
      
      <div className="mb-4">
        <span className="text-sm text-gray-600">Trạng thái hiện tại:</span>
        <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(currentStatus)}`}>
          {getStatusLabel(currentStatus)}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
          Cập nhật trạng thái thành công!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái mới
          </label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={handleEmailToggle}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="sendEmail" className="ml-2 block text-sm text-gray-700">
              Gửi email thông báo đến khách hàng
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={loading || status === currentStatus}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
        </button>
      </form>
    </div>
  );
};

export default OrderStatusUpdate; 
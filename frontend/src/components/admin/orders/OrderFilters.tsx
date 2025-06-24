import React, { useState } from 'react';
import { OrderFilters as OrderFiltersType } from '../../../services/adminOrderApiService';

interface OrderFiltersProps {
  initialFilters: OrderFiltersType;
  onApplyFilters: (filters: OrderFiltersType) => void;
  onExport: (format: 'pdf' | 'excel') => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  initialFilters,
  onApplyFilters,
  onExport,
}) => {
  const [filters, setFilters] = useState<OrderFiltersType>({
    ...initialFilters,
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    minAmount: initialFilters.minAmount || undefined,
    maxAmount: initialFilters.maxAmount || undefined,
    status: initialFilters.status || '',
  });

  const [isAdvancedFiltersVisible, setIsAdvancedFiltersVisible] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : parseFloat(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      ...initialFilters,
      startDate: '',
      endDate: '',
      minAmount: undefined,
      maxAmount: undefined,
      status: '',
      search: '',
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    try {
      await onExport(format);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleAdvancedFilters = () => {
    setIsAdvancedFiltersVisible(!isAdvancedFiltersVisible);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Bộ lọc đơn hàng</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
          </button>
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isExporting ? 'Đang xuất...' : 'Xuất PDF'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search || ''}
              onChange={handleInputChange}
              placeholder="Tìm theo mã đơn hàng, email..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-40">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={filters.status || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="SHIPPED">Đang giao hàng</option>
              <option value="DELIVERED">Đã giao hàng</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={toggleAdvancedFilters}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isAdvancedFiltersVisible ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'}
            </button>
          </div>
        </div>

        {isAdvancedFiltersVisible && (
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-40">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filters.startDate || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-40">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filters.endDate || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-40">
                <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị từ
                </label>
                <input
                  type="number"
                  id="minAmount"
                  name="minAmount"
                  value={filters.minAmount === undefined ? '' : filters.minAmount}
                  onChange={handleNumberInputChange}
                  min="0"
                  step="1000"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-40">
                <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị đến
                </label>
                <input
                  type="number"
                  id="maxAmount"
                  name="maxAmount"
                  value={filters.maxAmount === undefined ? '' : filters.maxAmount}
                  onChange={handleNumberInputChange}
                  min="0"
                  step="1000"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Đặt lại
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Áp dụng
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderFilters; 
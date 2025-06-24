import React, { useEffect, useState } from 'react';
import { adminDashboardApiService, TopProduct } from '../../../services/adminDashboardApiService';
import { Link } from 'react-router-dom';

interface TopProductsListProps {
  limit?: number;
  period?: string;
}

const TopProductsList: React.FC<TopProductsListProps> = ({ 
  limit = 5,
  period = 'month'
}) => {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(period);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const data = await adminDashboardApiService.getTopProducts(limit, selectedPeriod);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm bán chạy');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [limit, selectedPeriod]);

  const handlePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-200 rounded"></div>
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
        <h2 className="text-lg font-semibold">Sản phẩm bán chạy</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePeriodChange('week')}
            className={`px-3 py-1 rounded text-sm ${
              selectedPeriod === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            7 ngày
          </button>
          <button
            onClick={() => handlePeriodChange('month')}
            className={`px-3 py-1 rounded text-sm ${
              selectedPeriod === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            30 ngày
          </button>
          <button
            onClick={() => handlePeriodChange('year')}
            className={`px-3 py-1 rounded text-sm ${
              selectedPeriod === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            12 tháng
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu sản phẩm bán chạy
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {products.map((product) => (
            <div key={product.id} className="flex items-center py-4">
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>No image</span>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <Link
                  to={`/admin/products/${product.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {product.name}
                </Link>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                  <span className="mr-3">
                    Giá: {formatCurrency(product.price)}
                  </span>
                  <span className="mr-3">
                    Tồn kho: {product.stock}
                  </span>
                  {product.category && (
                    <span>
                      Danh mục: {product.category.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">
                  {product.totalSold} đã bán
                </div>
                {product.stock <= 5 && (
                  <div className="text-xs text-red-500 mt-1">
                    Sắp hết hàng
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

export default TopProductsList; 
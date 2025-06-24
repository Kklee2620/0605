import React, { useEffect, useState } from 'react';
import { adminDashboardApiService, DashboardStats } from '../../../services/adminDashboardApiService';

const StatsOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminDashboardApiService.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-6 rounded-lg shadow-sm h-32">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: stats?.totalProducts || 0,
      icon: '📦',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Tổng người dùng',
      value: stats?.totalUsers || 0,
      icon: '👥',
      color: 'bg-green-50 text-green-700',
    },
    {
      title: 'Tổng đơn hàng',
      value: stats?.totalOrders || 0,
      icon: '🛒',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: '💰',
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      title: 'Sản phẩm sắp hết hàng',
      value: stats?.lowStockProducts || 0,
      icon: '⚠️',
      color: 'bg-red-50 text-red-700',
    },
    {
      title: 'Đơn hàng chờ xử lý',
      value: stats?.pendingOrders || 0,
      icon: '⏳',
      color: 'bg-orange-50 text-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} p-6 rounded-lg shadow-sm transition-all hover:shadow-md`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium opacity-80">{card.title}</h3>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </div>
            <span className="text-2xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview; 
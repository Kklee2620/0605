import React from 'react';
import StatsOverview from '../../components/admin/dashboard/StatsOverview';
import SalesChart from '../../components/admin/dashboard/SalesChart';
import TopProductsList from '../../components/admin/dashboard/TopProductsList';
import RecentOrdersList from '../../components/admin/dashboard/RecentOrdersList';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Chào mừng đến với bảng điều khiển quản trị. Xem tổng quan về cửa hàng của bạn.
        </p>
      </div>

      <div className="mb-8">
        <StatsOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <TopProductsList limit={5} />
        </div>
      </div>

      <div className="mb-8">
        <RecentOrdersList limit={5} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;

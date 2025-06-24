import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { adminDashboardApiService, SalesData } from '../../../services/adminDashboardApiService';

interface SalesChartProps {
  period?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ period = 'month' }) => {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(period);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const data = await adminDashboardApiService.getSalesData(selectedPeriod);
        setSalesData(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu doanh số');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedPeriod]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (selectedPeriod === 'year') {
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm h-80 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-48 bg-gray-100 rounded"></div>
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
        <h2 className="text-lg font-semibold">Biểu đồ doanh số</h2>
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

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={salesData?.data || []}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#888"
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#888"
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Ngày: ${formatDate(label)}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              name="Doanh số"
              stroke="#4f46e5"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="orders"
              name="Số đơn hàng"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart; 
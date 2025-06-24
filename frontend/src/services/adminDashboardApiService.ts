import { API_BASE_URL } from '../config';

export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingOrders: number;
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
}

export interface SalesData {
  data: SalesDataPoint[];
  period: string;
  interval: 'day' | 'week' | 'month';
  startDate: string;
  endDate: string;
}

export interface TopProduct {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  totalSold: number;
  stock: number;
  category?: {
    id: string;
    name: string;
  };
}

export interface RecentOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    priceAtPurchase: number;
    product: {
      id: string;
      name: string;
      imageUrls: string[];
    };
  }>;
}

class AdminDashboardApiService {
  private baseUrl = `${API_BASE_URL}/admin/dashboard`;

  async getStats(): Promise<DashboardStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  }

  async getSalesData(
    period: string = 'month',
    start?: string,
    end?: string
  ): Promise<SalesData> {
    let url = `${this.baseUrl}/sales?period=${period}`;
    
    if (start) url += `&start=${start}`;
    if (end) url += `&end=${end}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sales data');
    }

    return response.json();
  }

  async getTopProducts(
    limit: number = 5,
    period: string = 'month'
  ): Promise<TopProduct[]> {
    const response = await fetch(
      `${this.baseUrl}/top-products?limit=${limit}&period=${period}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch top products');
    }

    return response.json();
  }

  async getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    const response = await fetch(`${this.baseUrl}/recent-orders?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recent orders');
    }

    return response.json();
  }
}

export const adminDashboardApiService = new AdminDashboardApiService(); 
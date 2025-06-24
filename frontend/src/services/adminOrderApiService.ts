import { API_BASE_URL } from '../config';

export interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    id: string;
    name: string;
    imageUrls: string[];
    description?: string;
  };
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  items: OrderItem[];
  shippingAddress?: {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

class AdminOrderApiService {
  private baseUrl = `${API_BASE_URL}/admin/orders`;

  async getOrders(filters: OrderFilters = {}): Promise<OrdersResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.minAmount) queryParams.append('minAmount', filters.minAmount.toString());
    if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount.toString());
    if (filters.search) queryParams.append('search', filters.search);

    const url = `${this.baseUrl}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order with ID ${id}`);
    }

    return response.json();
  }

  async updateOrderStatus(
    id: string,
    status: string,
    sendEmail: boolean = false
  ): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status, sendEmail }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order status`);
    }

    return response.json();
  }

  async exportOrders(
    format: 'pdf' | 'excel' = 'excel',
    filters: {
      status?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('format', format);
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);

    const url = `${this.baseUrl}/export?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export orders');
    }

    return response.blob();
  }
}

export const adminOrderApiService = new AdminOrderApiService();

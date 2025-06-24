
import { API_BASE_URL } from '../config';
import { Order, ShippingDetails } from '../types';

export interface CreateOrderItemDtoFE { 
  productId: string;
  quantity: number;
  selectedOptions?: { [key: string]: string };
}
export interface CreateOrderPayloadDtoFE {
  items: CreateOrderItemDtoFE[];
  shippingAddress: ShippingDetails;
  paymentMethod?: string;
}

export const createOrderApi = async (orderData: CreateOrderPayloadDtoFE, token: string): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create order');
  }
  return response.json() as Promise<Order>; 
};

export const fetchUserOrdersApi = async (token: string): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
     const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user orders');
  }
  return response.json() as Promise<Order[]>;
};

// New API function to check if user purchased a product
export const checkIfUserPurchasedProductApi = async (
  productId: string,
  token: string
): Promise<{ purchased: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/orders/has-purchased/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to check purchase status' })); // Catch if body is not JSON
    throw new Error(errorData.message || 'Failed to check purchase status');
  }
  return response.json() as Promise<{ purchased: boolean }>;
};

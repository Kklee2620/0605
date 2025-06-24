
import { API_BASE_URL } from '../config';
import { DiscountApplicationResult } from '../types';

export const applyDiscountApi = async (
  code: string,
  currentCartTotal: number, // Pass current cart total for backend calculation
  // token?: string // Token might be needed for user-specific discounts or tracking
): Promise<DiscountApplicationResult> => {
  const queryParams = new URLSearchParams({ cartTotal: currentCartTotal.toString() });
  const response = await fetch(`${API_BASE_URL}/discounts/apply?${queryParams.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // ...(token && { 'Authorization': `Bearer ${token}` }), // Add token if endpoint becomes protected
    },
    body: JSON.stringify({ code }),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to apply discount code');
  }
  return responseData as DiscountApplicationResult;
};

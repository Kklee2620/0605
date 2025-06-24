
import { API_BASE_URL } from '../config';
import { Review } from '../types';

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

// API to add a review for a product
export const addReviewApi = async (
  productId: string,
  reviewData: CreateReviewPayload,
  token: string
): Promise<Review> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit review');
  }
  return response.json() as Promise<Review>; // Backend should return the created review
};

// API to fetch all reviews for a product
export const fetchReviewsApi = async (productId: string): Promise<Review[]> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch reviews');
  }
  return response.json() as Promise<Review[]>;
};

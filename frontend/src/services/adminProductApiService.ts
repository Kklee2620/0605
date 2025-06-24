
import { API_BASE_URL } from '../config';
import { Product, ProductCategory, ProductOption } from '../types'; // Adjust if DTO types are needed

// Matches backend CreateProductDto / UpdateProductDto structure
// For simplicity, we can use Partial<Product> for update if fields align,
// or define specific DTOs.
export interface AdminProductPayload {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: ProductCategory;
  stock: number;
  options?: ProductOption[];
  // rating and reviews are no longer part of the payload,
  // they are derived values (averageRating, reviewCount) handled by backend.
}


export const createProductApi = async (productData: AdminProductPayload, token: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create product');
  }
  return response.json();
};

export const updateProductApi = async (id: string, productData: Partial<AdminProductPayload>, token: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update product');
  }
  return response.json();
};

export const deleteProductApi = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    // For 204 No Content, response.json() will fail. Check status first.
    if (response.status === 204) return; 
    const errorData = await response.json().catch(() => ({ message: 'Failed to delete product and parse error' })); // Catch parsing error for empty body
    throw new Error(errorData.message || 'Failed to delete product');
  }
  // No content expected on successful delete (204)
};

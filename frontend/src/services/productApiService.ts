
import { API_BASE_URL } from '../config';
import { Product, ProductCategory, ProductOption, PaginatedResponse } from '../types';

// Interface for BackendProductDto for stronger typing if structure is known
// For now, we assume the backend ProductResponseDto matches the frontend Product type for simplicity,
// but in a real app, you'd have specific DTO interfaces.
// The backend's ProductResponseDto now has averageRating, reviewCount, and createdAt as Date.
// Frontend Product type needs to align or we need a mapping.
// Current frontend Product has averageRating and reviewCount as optional numbers, createdAt as string.
// ProductResponseDto in backend has price as number, averageRating as number, reviewCount as number, createdAt as Date.
// We need a mapping function.

interface BackendProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number; // Is number
  imageUrls: string[];
  category: string; // Backend sends string
  stock: number;
  options?: ProductOption[];
  averageRating: number; // Is number
  reviewCount: number;   // Is number
  reviewsData?: any[]; // Assuming ReviewResponseDto structure from backend
  createdAt: string; // Backend service maps Date to ISO string in ProductResponseDto
}


const mapBackendProductToFrontend = (dto: BackendProductResponseDto): Product => {
  return {
    ...dto,
    category: dto.category as ProductCategory, // Cast category
    // Ensure createdAt is string if backend sends Date object (it should send ISO string)
    createdAt: dto.createdAt, 
    // averageRating and reviewCount are numbers, matching optional numbers in Product
    averageRating: dto.averageRating,
    reviewCount: dto.reviewCount,
  };
};

interface FetchProductsParams {
  category?: string;
  searchTerm?: string;
  sortBy?: 'price' | 'createdAt' | 'averageRating' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const fetchProducts = async (
  params: FetchProductsParams = {}
): Promise<PaginatedResponse<Product>> => {
  const queryParams = new URLSearchParams();
  if (params.category) queryParams.append('category', params.category);
  if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch products' }));
    throw new Error(errorData.message);
  }
  const paginatedData = await response.json();
  return {
    ...paginatedData,
    data: paginatedData.data.map(mapBackendProductToFrontend),
  };
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    const errorData = await response.json().catch(() => ({ message: `Failed to fetch product with id ${id}` }));
    throw new Error(errorData.message);
  }
  const data: BackendProductResponseDto = await response.json();
  return mapBackendProductToFrontend(data);
};

export const fetchRelatedProducts = async (productId: string, limit: number = 4): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/related?limit=${limit}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch related products' }));
    throw new Error(errorData.message);
  }
  const data: BackendProductResponseDto[] = await response.json();
  return data.map(mapBackendProductToFrontend);
};

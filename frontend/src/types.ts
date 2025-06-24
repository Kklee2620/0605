
export type ProductCategory = 'Furniture' | 'Lighting' | 'Home Decor' | 'Appliances' | 'Electronics' | 'Apparel' | 'Books' | 'Kitchenware';

export interface ProductOptionValue {
  value: string;
  available: boolean;
}
export interface ProductOption {
  name: string; // e.g., "Color", "Size"
  values: ProductOptionValue[]; // e.g., ["Red", "Blue"], ["S", "M", "L"]
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string; 
  user: { name?: string | null }; 
  userId: string;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: ProductCategory;
  stock: number;
  options?: ProductOption[];
  averageRating?: number;  // Made optional as it might not exist for new products
  reviewCount?: number;    // Made optional
 
  createdAt: string; 
}

export interface CartItem extends Product {
  cartItemId: string; 
  quantity: number;
  selectedOptions?: { [key: string]: string };
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedOptions?: { [key: string]: string }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  generateCartItemId: (productId: string, options?: { [key: string]: string }) => string;
}

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole; 
  createdAt?: string; 
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  token: string | null; 
}

export interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderProductItem {
  productId: string; 
  productName: string;
  quantity: number;
  priceAtPurchase: number; 
  selectedOptions?: { [key: string]: string }; 
  productImageUrl?: string | null; 
  id?: string; // This is OrderItemID from backend
}

export interface ShippingDetails {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}
export interface Order {
  id: string; 
  userId: string; 
  user?: { 
    id: string;
    name?: string | null;
    email: string;
  };
  totalAmount: number; 
  originalTotalAmount?: number; 
  discountCode?: string | null;
  discountAmount?: number | null; 
  status: OrderStatus; 
  shippingAddress: ShippingDetails; 
  paymentMethod?: string | null;
  createdAt: string; 
  updatedAt: string; 
  items: OrderProductItem[];
}

export interface AdminOrderSummary {
  id: string;
  user: {
    id: string;
    name?: string | null;
    email: string;
  };
  totalAmount: number; 
  status: OrderStatus;
  createdAt: string; 
  itemCount: number;
}

export interface AdminUserSummary extends User {}

export interface DiscountApplicationResult {
  success: boolean;
  message: string;
  originalTotal?: number;
  discountAmountApplied?: number;
  newTotal?: number;
  discountCode?: string;
}

// Generic type for paginated API responses
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

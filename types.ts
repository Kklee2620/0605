export type ProductCategory = 'Furniture' | 'Lighting' | 'Home Decor' | 'Appliances' | 'Electronics' | 'Apparel' | 'Books' | 'Kitchenware';

export interface ProductOptionValue {
  value: string;
  available: boolean;
}
export interface ProductOption {
  name: string; // e.g., "Color", "Size"
  values: ProductOptionValue[]; // e.g., ["Red", "Blue"], ["S", "M", "L"]
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
  rating?: number;
  reviews?: number;
  createdAt: string; // ISO date string for sorting by newness
}

export interface CartItem extends Product {
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
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Represents a product item within an order
export interface OrderProductItem {
  id: string;
  name: string;
  quantity: number;
  price: number; // Price at the time of purchase
  imageUrl: string; // Typically the first image
  selectedOptions?: { [key: string]: string };
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
  id: string; // Order ID
  date: string; // ISO date string
  total: number; // Total amount
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderProductItem[]; // Array of products in the order
  shippingDetails: ShippingDetails;
  paymentMethod: string;
}
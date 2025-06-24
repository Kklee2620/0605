
import { Product, ProductCategory, User, Order, ShippingDetails, OrderProductItem, OrderStatus } from './types';

export enum RoutePath {
  Home = '/',
  ProductDetail = '/products/:id',
  Cart = '/cart',
  Checkout = '/checkout',
  Login = '/login',
  Register = '/register',
  Account = '/account',
  OrderConfirmation = '/order-confirmation',
  About = '/about',
  Contact = '/contact',
  CategoryPage = '/category/:categoryName',
  PrivacyPolicy = '/privacy-policy',
  ReturnPolicy = '/return-policy',
  ShippingPolicy = '/shipping-policy',
  SearchResultsPage = '/search',

  // Admin Paths
  AdminDashboard = '/admin',
  AdminProducts = '/admin/products',
  AdminProductCreate = '/admin/products/create',
  AdminProductEdit = '/admin/products/edit/:id',
  AdminOrders = '/admin/orders', // This will be the list page
  AdminOrderDetail = '/admin/orders/:orderId', // For order detail
  AdminUsers = '/admin/users',   // Placeholder for future
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Modern Accent Chair',
    description: 'A stylish and comfortable accent chair, perfect for any modern living space. Upholstered in premium fabric.',
    price: 299.99,
    imageUrls: ['https://picsum.photos/seed/chair1/600/600', 'https://picsum.photos/seed/chair1_2/600/600', 'https://picsum.photos/seed/chair1_3/600/600'],
    category: 'Furniture',
    stock: 15,
    options: [
      { name: 'Color', values: [{value: 'Grey', available: true}, {value: 'Beige', available: true}, {value: 'Navy Blue', available: false}] },
    ],
    averageRating: 4.5,
    reviewCount: 67,
    createdAt: '2024-05-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Minimalist Desk Lamp',
    description: 'Sleek and functional LED desk lamp with adjustable brightness. Enhances your workspace aesthetics.',
    price: 79.50,
    imageUrls: ['https://picsum.photos/seed/lamp2/600/600'],
    category: 'Lighting',
    stock: 30,
    averageRating: 4.2,
    reviewCount: 45,
    createdAt: '2024-05-15T11:30:00Z',
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, breathable, and eco-friendly T-Shirt. A wardrobe essential.',
    price: 45.00,
    imageUrls: ['https://picsum.photos/seed/tshirt3/600/600', 'https://picsum.photos/seed/tshirt3_2/600/600'],
    category: 'Apparel',
    stock: 50,
    options: [
      { name: 'Size', values: [{value: 'S', available: true}, {value: 'M', available: true}, {value: 'L', available: true}, {value: 'XL', available: false}] },
      { name: 'Color', values: [{value: 'White', available: true}, {value: 'Black', available: true}, {value: 'Heather Grey', available: true}] },
    ],
    averageRating: 4.8,
    reviewCount: 120,
    createdAt: '2024-04-20T09:00:00Z',
  },
  {
    id: '4',
    name: 'Smart Coffee Maker',
    description: 'Wi-Fi enabled coffee maker that brews your perfect cup on demand. Control via app or voice.',
    price: 129.00,
    imageUrls: ['https://picsum.photos/seed/coffee4/600/600', 'https://picsum.photos/seed/coffee4_2/600/600'],
    category: 'Appliances',
    stock: 0, 
    averageRating: 4.0,
    reviewCount: 88,
    createdAt: '2024-05-25T14:00:00Z',
  },
  {
    id: '5',
    name: 'Bookshelf Speakers (Pair)',
    description: 'High-fidelity bookshelf speakers delivering crisp sound and deep bass. Elegant wood finish.',
    price: 349.99,
    imageUrls: ['https://picsum.photos/seed/speakers5/600/600'],
    category: 'Electronics',
    stock: 10,
    averageRating: 4.6,
    reviewCount: 72,
    createdAt: '2024-03-10T16:20:00Z',
  },
  {
    id: '6',
    name: 'Artisan Ceramic Vase Set',
    description: 'Handcrafted ceramic vase set of 3 with unique glazes. Beautiful centerpieces for any room.',
    price: 65.00,
    imageUrls: ['https://picsum.photos/seed/vase6/600/600', 'https://picsum.photos/seed/vase6_2/600/600'],
    category: 'Home Decor',
    stock: 18,
    averageRating: 4.3,
    reviewCount: 30,
    createdAt: '2024-05-10T08:15:00Z',
  },
  {
    id: '7',
    name: 'Gourmet Chef Knife',
    description: 'Professional-grade chef knife, forged from high-carbon stainless steel for ultimate precision and durability.',
    price: 89.99,
    imageUrls: ['https://picsum.photos/seed/knife7/600/600'],
    category: 'Kitchenware',
    stock: 25,
    options: [
      { name: 'Blade Length', values: [{value: '8 inch', available: true}, {value: '10 inch', available: true}] }
    ],
    averageRating: 4.9,
    reviewCount: 150,
    createdAt: '2024-02-15T13:05:00Z',
  },
  {
    id: '8',
    name: 'The Mystery of Clockwork',
    description: 'A thrilling mystery novel set in Victorian England, full of twists and turns.',
    price: 19.95,
    imageUrls: ['https://picsum.photos/seed/book8/600/600'],
    category: 'Books',
    stock: 40,
    averageRating: 4.4,
    reviewCount: 95,
    createdAt: '2024-01-20T10:45:00Z',
  },
];

export const CATEGORIES: ProductCategory[] = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category))).sort();

export const MOCK_BANNERS = [
  { id: 'banner1', imageUrl: 'https://picsum.photos/seed/bannerA/1200/400', title: 'Summer Collection Out Now!', subtitle: 'Up to 30% off on select items.', link: `/category/Apparel`, buttonText: 'Shop Apparel' },
  { id: 'banner2', imageUrl: 'https://picsum.photos/seed/bannerB/1200/400', title: 'New Arrivals: Electronics', subtitle: 'Discover the latest gadgets.', link: `/category/Electronics`, buttonText: 'Explore Tech' },
  { id: 'banner3', imageUrl: 'https://picsum.photos/seed/bannerC/1200/400', title: 'Home Decor Refresh', subtitle: 'Find unique pieces for your home.', link: `/category/Home%20Decor`, buttonText: 'Style Your Space' },
];

export const MOCK_USERS: User[] = [
  { id: 'user-admin-01', email: 'admin@example.com', name: 'Admin User', role: 'ADMIN' },
  { id: 'user-test-02', email: 'test@example.com', name: 'Test User', role: 'USER' },
];

const mockShippingDetails: ShippingDetails = {
    fullName: 'Test User',
    address: '123 Mock Street',
    city: 'Mockville',
    postalCode: 'M1C K3R',
    country: 'Mockland',
    phone: '555-1234'
};

export const MOCK_ORDERS: Order[] = [
    {
        id: 'ORD-1621090000000', 
        userId: MOCK_USERS[1].id, 
        totalAmount: 379.49,
        status: OrderStatus.SHIPPED, // Updated to use enum
        shippingAddress: mockShippingDetails,
        paymentMethod: 'Credit Card',
        createdAt: '2024-05-15T14:30:00Z',
        updatedAt: '2024-05-16T10:00:00Z',
        items: [
            { id: 'orderitem-1', productId: MOCK_PRODUCTS[0].id, productName: MOCK_PRODUCTS[0].name, quantity: 1, priceAtPurchase: MOCK_PRODUCTS[0].price, productImageUrl: MOCK_PRODUCTS[0].imageUrls[0], selectedOptions: {'Color': 'Grey'} },
            { id: 'orderitem-2', productId: MOCK_PRODUCTS[1].id, productName: MOCK_PRODUCTS[1].name, quantity: 1, priceAtPurchase: MOCK_PRODUCTS[1].price, productImageUrl: MOCK_PRODUCTS[1].imageUrls[0] },
        ]
    },
    {
        id: 'ORD-1621521600000',
        userId: MOCK_USERS[1].id,
        totalAmount: 45.00,
        status: OrderStatus.PROCESSING, // Updated to use enum
        shippingAddress: mockShippingDetails,
        paymentMethod: 'COD',
        createdAt: '2024-05-20T10:00:00Z',
        updatedAt: '2024-05-20T10:05:00Z',
        items: [
             { id: 'orderitem-3', productId: MOCK_PRODUCTS[2].id, productName: MOCK_PRODUCTS[2].name, quantity: 1, priceAtPurchase: MOCK_PRODUCTS[2].price, productImageUrl: MOCK_PRODUCTS[2].imageUrls[0], selectedOptions: {'Size': 'M', 'Color': 'Black'} },
        ]
    }
];

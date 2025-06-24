import { Product, ProductCategory, User, Order, ShippingDetails, OrderProductItem } from './types';

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
    rating: 4.5,
    reviews: 67,
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
    rating: 4.2,
    reviews: 45,
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
    rating: 4.8,
    reviews: 120,
    createdAt: '2024-04-20T09:00:00Z',
  },
  {
    id: '4',
    name: 'Smart Coffee Maker',
    description: 'Wi-Fi enabled coffee maker that brews your perfect cup on demand. Control via app or voice.',
    price: 129.00,
    imageUrls: ['https://picsum.photos/seed/coffee4/600/600', 'https://picsum.photos/seed/coffee4_2/600/600'],
    category: 'Appliances',
    stock: 0, // Out of stock example
    rating: 4.0,
    reviews: 88,
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
    rating: 4.6,
    reviews: 72,
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
    rating: 4.3,
    reviews: 30,
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
    rating: 4.9,
    reviews: 150,
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
    rating: 4.4,
    reviews: 95,
    createdAt: '2024-01-20T10:45:00Z',
  },
];

export const CATEGORIES: ProductCategory[] = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category))).sort();

export const MOCK_BANNERS = [
  { id: 'banner1', imageUrl: 'https://picsum.photos/seed/bannerA/1200/400', title: 'Summer Collection Out Now!', subtitle: 'Up to 30% off on select items.', link: `/category/Apparel`, buttonText: 'Shop Apparel' },
  { id: 'banner2', imageUrl: 'https://picsum.photos/seed/bannerB/1200/400', title: 'New Arrivals: Electronics', subtitle: 'Discover the latest gadgets.', link: `/category/Electronics`, buttonText: 'Explore Tech' },
];

export const MOCK_USERS: User[] = [
  { id: 'user1', email: 'test@example.com', name: 'Test User' },
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
        id: 'ORD-1621090000000', // Example Order ID
        date: '2024-05-15T14:30:00Z',
        total: 379.49,
        status: 'Shipped',
        shippingDetails: mockShippingDetails,
        paymentMethod: 'Credit Card',
        items: [
            { id: MOCK_PRODUCTS[0].id, name: MOCK_PRODUCTS[0].name, quantity: 1, price: MOCK_PRODUCTS[0].price, imageUrl: MOCK_PRODUCTS[0].imageUrls[0], selectedOptions: {'Color': 'Grey'} },
            { id: MOCK_PRODUCTS[1].id, name: MOCK_PRODUCTS[1].name, quantity: 1, price: MOCK_PRODUCTS[1].price, imageUrl: MOCK_PRODUCTS[1].imageUrls[0] },
        ]
    },
    {
        id: 'ORD-1621521600000',
        date: '2024-05-20T10:00:00Z',
        total: 45.00,
        status: 'Processing',
        shippingDetails: mockShippingDetails,
        paymentMethod: 'COD',
        items: [
             { id: MOCK_PRODUCTS[2].id, name: MOCK_PRODUCTS[2].name, quantity: 1, price: MOCK_PRODUCTS[2].price, imageUrl: MOCK_PRODUCTS[2].imageUrls[0], selectedOptions: {'Size': 'M', 'Color': 'Black'} },
        ]
    }
];
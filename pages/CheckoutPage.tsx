import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { CartContextType, AuthContextType, CartItem, OrderProductItem, ShippingDetails } from '../types';
import { Button } from '../components/Button';
import { RoutePath } from '../constants';
import { ChevronLeftIcon } from '../components/icons';

// FormData remains the same
interface FormData extends ShippingDetails {}

const CheckoutItem: React.FC<{ item: CartItem }> = ({ item }) => (
  <div className="flex justify-between items-center py-2 border-b last:border-none">
    <div className="flex items-center">
      <img src={item.imageUrls[0]} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" />
      <div>
        <p className="text-sm font-medium text-gray-800">{item.name}</p>
        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
         {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
            <p className="text-xs text-gray-500">
                {Object.entries(item.selectedOptions).map(([key, value]) => `${key}: ${value}`).join(', ')}
            </p>
        )}
      </div>
    </div>
    <p className="text-sm text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
  </div>
);

export const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext) as CartContextType;
  const { currentUser } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: currentUser?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'card_placeholder'

  useEffect(() => {
    if (cartItems.length === 0 && currentUser) { // Only redirect if logged in and cart empty
      navigate(RoutePath.Home); 
    }
  }, [cartItems, navigate, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        alert("Error: User not found. Please log in again.");
        navigate(RoutePath.Login);
        return;
    }
    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode || !formData.country) {
        alert("Please fill in all required shipping details.");
        return;
    }

    const orderId = `ORD-${Date.now()}`;
    const orderItems: OrderProductItem[] = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      imageUrl: item.imageUrls[0],
      selectedOptions: item.selectedOptions
    }));

    const orderDetails = {
      orderId,
      items: orderItems,
      total: getCartTotal(),
      shippingDetails: formData,
      paymentMethod,
      userEmail: currentUser.email, // Optionally pass user email
      userName: currentUser.name,
    };
    
    // Simulate saving order to MOCK_ORDERS or backend
    console.log("Order placed:", orderDetails);
    
    clearCart();
    navigate(RoutePath.OrderConfirmation, { state: { orderDetails } }); 
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={RoutePath.Cart} className="inline-flex items-center text-indigo-600 hover:underline mb-6 text-sm group">
          <ChevronLeftIcon className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shipping Details Column */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              </div>
               <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              </div>
            </div>
             <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Method</h3>
                <div className="space-y-3">
                    <label htmlFor="cod" className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500">
                        <input type="radio" name="paymentMethod" id="cod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                        <span className="ml-3 block text-sm font-medium text-gray-700">Cash on Delivery (COD)</span>
                    </label>
                    <label htmlFor="card_placeholder" className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500">
                        <input type="radio" name="paymentMethod" id="card_placeholder" value="card_placeholder" checked={paymentMethod === 'card_placeholder'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                        <span className="ml-3 block text-sm font-medium text-gray-700">Credit/Debit Card (Placeholder)</span>
                    </label>
                     {paymentMethod === 'card_placeholder' && <p className="text-xs text-gray-500 pl-7">Card payment integration coming soon!</p>}
                </div>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg shadow-lg h-fit sticky top-20">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Order Summary</h2>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {cartItems.map(item => <CheckoutItem key={item.id + JSON.stringify(item.selectedOptions)} item={item} />)}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t mt-2">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full mt-8">
              Place Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
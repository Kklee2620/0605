
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { CartContextType, AuthContextType, CartItem, ShippingDetails, Order, DiscountApplicationResult } from '../types';
import { Button } from '../components/Button';
import { RoutePath } from '../constants';
import { ChevronLeftIcon } from '../components/icons';
import { createOrderApi, CreateOrderItemDtoFE } from '../services/orderApiService';
import { applyDiscountApi } from '../services/discountApiService'; // Import discount API

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
  const { currentUser, token } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: '', 
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); 

  // Discount state
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountApplicationResult | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);

  const cartTotal = getCartTotal();
  const finalTotal = appliedDiscount?.success ? appliedDiscount.newTotal ?? cartTotal : cartTotal;

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({ ...prev, fullName: currentUser.name || '' }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (cartItems.length === 0 && currentUser) { 
      navigate(RoutePath.Home); 
    }
     // Reset discount if cart changes significantly (e.g. total changes)
    setAppliedDiscount(null);
    setDiscountMessage(null);
    setDiscountCodeInput('');
  }, [cartItems, currentUser, navigate, cartTotal]); // Re-evaluate if cartTotal changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyDiscount = async () => {
    if (!discountCodeInput.trim()) {
      setDiscountMessage("Please enter a discount code.");
      return;
    }
    setIsApplyingDiscount(true);
    setDiscountMessage(null);
    setError(null);
    try {
      const result = await applyDiscountApi(discountCodeInput, cartTotal);
      setAppliedDiscount(result);
      setDiscountMessage(result.message);
      if (!result.success) {
        setDiscountCodeInput(''); // Clear input on failed attempt
      }
    } catch (err: any) {
      setDiscountMessage(err.message || "Failed to apply discount.");
      setAppliedDiscount(null);
    } finally {
      setIsApplyingDiscount(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentUser || !token) {
        setError("Authentication error. Please log in again.");
        return;
    }
    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode || !formData.country) {
        setError("Please fill in all required shipping details.");
        return;
    }

    setIsPlacingOrder(true);

    const orderPayloadItems: CreateOrderItemDtoFE[] = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
    }));

    const orderPayload = {
      items: orderPayloadItems,
      shippingAddress: formData,
      paymentMethod,
      discountCode: appliedDiscount?.success ? appliedDiscount.discountCode : undefined,
    };

    try {
      const createdOrder: Order = await createOrderApi(orderPayload, token);
      
      const orderDetailsForConfirmation = {
        orderId: createdOrder.id,
        items: createdOrder.items.map(item => ({ 
            id: item.id, 
            productId: item.productId,
            name: item.productName,
            quantity: item.quantity,
            price: item.priceAtPurchase, 
            imageUrl: item.productImageUrl || (item.productId && cartItems.find(ci => ci.id === item.productId)?.imageUrls[0]) || '',
            selectedOptions: item.selectedOptions,
        })),
        total: createdOrder.totalAmount, // This is the final amount from backend
        originalTotal: createdOrder.originalTotalAmount,
        discountApplied: createdOrder.discountAmount,
        discountCode: createdOrder.discountCode,
        shippingDetails: createdOrder.shippingAddress,
        paymentMethod: createdOrder.paymentMethod || 'N/A',
      };
      
      clearCart();
      navigate(RoutePath.OrderConfirmation, { state: { orderDetails: orderDetailsForConfirmation } }); 

    } catch (err: any) {
      console.error("Failed to place order:", err);
      setError(err.message || 'There was an issue placing your order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0 && !isPlacingOrder) return null;

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={RoutePath.Cart} className="inline-flex items-center text-indigo-600 hover:underline mb-6 text-sm group">
          <ChevronLeftIcon className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Details</h2>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            {/* Shipping form fields... */}
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" disabled={isPlacingOrder} />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" disabled={isPlacingOrder}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" disabled={isPlacingOrder}/>
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" disabled={isPlacingOrder}/>
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" disabled={isPlacingOrder}/>
              </div>
               <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" disabled={isPlacingOrder}/>
              </div>
            </div>
            {/* Payment Method */}
             <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Method</h3>
                <div className="space-y-3">
                    <label htmlFor="cod" className={`flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500 ${isPlacingOrder ? 'opacity-50 cursor-not-allowed': ''}`}>
                        <input type="radio" name="paymentMethod" id="cod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" disabled={isPlacingOrder}/>
                        <span className="ml-3 block text-sm font-medium text-gray-700">Cash on Delivery (COD)</span>
                    </label>
                    <label htmlFor="card_placeholder" className={`flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500 ${isPlacingOrder ? 'opacity-50 cursor-not-allowed': ''}`}>
                        <input type="radio" name="paymentMethod" id="card_placeholder" value="card_placeholder" checked={paymentMethod === 'card_placeholder'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" disabled={isPlacingOrder}/>
                        <span className="ml-3 block text-sm font-medium text-gray-700">Credit/Debit Card (Placeholder)</span>
                    </label>
                     {paymentMethod === 'card_placeholder' && <p className="text-xs text-gray-500 pl-7">Card payment integration coming soon!</p>}
                </div>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg shadow-lg h-fit sticky top-20">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Order Summary</h2>
            
            {/* Discount Code Input */}
            <div className="mb-4">
              <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700">Discount Code</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="discountCode"
                  id="discountCode"
                  value={discountCodeInput}
                  onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-2"
                  disabled={isApplyingDiscount || !!(appliedDiscount?.success)}
                />
                <Button
                  type="button"
                  onClick={handleApplyDiscount}
                  isLoading={isApplyingDiscount}
                  disabled={isApplyingDiscount || !discountCodeInput.trim() || !!(appliedDiscount?.success)}
                  className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm"
                >
                  Apply
                </Button>
              </div>
              {discountMessage && (
                <p className={`text-xs mt-1 ${appliedDiscount?.success ? 'text-green-600' : 'text-red-600'}`}>
                  {discountMessage}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {cartItems.map(item => <CheckoutItem key={item.cartItemId} item={item} />)}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {appliedDiscount?.success && appliedDiscount.discountAmountApplied && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedDiscount.discountCode})</span>
                  <span>-${appliedDiscount.discountAmountApplied.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t mt-2">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full mt-8" isLoading={isPlacingOrder} disabled={isPlacingOrder || cartItems.length === 0}>
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

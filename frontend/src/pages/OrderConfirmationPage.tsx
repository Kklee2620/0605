
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Order, OrderProductItem, ShippingDetails } from '../types'; // Order type might need update for discount info
import { RoutePath } from '../constants';
import { Button } from '../components/Button';
import { CheckCircleIcon } from '../components/icons';

interface LocationStateOrderDetails {
  orderId: string;
  items: OrderProductItem[];
  total: number; // This should be the final total
  originalTotal?: number; // Total before discount
  discountApplied?: number; // Amount of discount
  discountCode?: string | null;
  shippingDetails: ShippingDetails;
  paymentMethod: string;
}
interface LocationState {
  orderDetails: LocationStateOrderDetails;
}

const OrderItemSummary: React.FC<{ item: OrderProductItem }> = ({ item }) => (
  <div className="flex items-start py-3 border-b last:border-b-0">
    <img src={item.productImageUrl || 'https://via.placeholder.com/64x64.png?text=No+Image'} alt={item.productName} className="w-16 h-16 object-cover rounded mr-4" />
    <div className="flex-grow">
      <p className="font-medium text-gray-800">{item.productName}</p>
      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
        <p className="text-xs text-gray-500">
          {Object.entries(item.selectedOptions).map(([key, value]) => `${key}: ${value}`).join(', ')}
        </p>
      )}
    </div>
    <p className="text-sm text-gray-700 font-medium">${(Number(item.priceAtPurchase) * item.quantity).toFixed(2)}</p>
  </div>
);

export const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  if (!state || !state.orderDetails) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Order Information Not Found</h1>
        <p className="text-gray-600 mb-6">There was an issue retrieving your order details.</p>
        <Button as={Link} to={RoutePath.Home} variant="primary">
          Go to Homepage
        </Button>
      </div>
    );
  }

  const { 
    orderId, 
    items, 
    total, 
    originalTotal, 
    discountApplied, 
    discountCode, 
    shippingDetails, 
    paymentMethod 
  } = state.orderDetails;

  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You For Your Order!</h1>
          <p className="text-gray-600 mb-1">Your order <span className="font-semibold text-indigo-600">#{orderId ? orderId.substring(0,8) : 'N/A'}...</span> has been placed successfully.</p>
          <p className="text-gray-600 mb-6">You will receive an email confirmation shortly. (Mock)</p>
          
          <div className="text-left bg-gray-50 p-6 rounded-lg my-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
            <div className="space-y-2 mb-4 max-h-72 overflow-y-auto">
                {items.map(item => <OrderItemSummary key={item.id || item.productId} item={item} />)}
            </div>
            <div className="border-t pt-4 space-y-1">
                {typeof originalTotal === 'number' && typeof discountApplied === 'number' && discountApplied > 0 ? (
                  <>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-800">${originalTotal.toFixed(2)}</span>
                    </div>
                    {discountCode && (
                       <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({discountCode}):</span>
                          <span>-${discountApplied.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                ) : (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-800">${total.toFixed(2)}</span>
                    </div>
                )}
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-1">
                    <span className="text-gray-800">Total Paid:</span>
                    <span className="text-indigo-600">${total.toFixed(2)}</span>
                </div>
            </div>
          </div>

          <div className="text-left bg-gray-50 p-6 rounded-lg my-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Shipping Details</h2>
            <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {shippingDetails.fullName}</p>
            <p className="text-sm text-gray-700"><span className="font-medium">Address:</span> {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.postalCode}, {shippingDetails.country}</p>
            {shippingDetails.phone && <p className="text-sm text-gray-700"><span className="font-medium">Phone:</span> {shippingDetails.phone}</p>}
             <p className="text-sm text-gray-700 mt-2"><span className="font-medium">Payment Method:</span> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card (Mock)'}</p>
          </div>
          
          <Button as={Link} to={RoutePath.Home} variant="primary" size="lg" className="mt-4">
            Continue Shopping
          </Button>
           <Button as={Link} to={RoutePath.Account} variant="secondary" size="lg" className="mt-4 ml-4">
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
};
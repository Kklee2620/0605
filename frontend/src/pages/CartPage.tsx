
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { CartContextType, CartItem, AuthContextType } from '../types';
import { Button } from '../components/Button';
import { TrashIcon, PlusIcon, MinusIcon, ChevronLeftIcon, ShoppingCartIcon } from '../components/icons';
import { RoutePath } from '../constants';

export const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext) as CartContextType;
  const { currentUser } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <ShoppingCartIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button variant="primary" size="lg" as={Link} to={RoutePath.Home}>
          Start Shopping
        </Button>
      </div>
    );
  }

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    // item.cartItemId is the unique ID for the cart entry
    if (newQuantity <= 0) {
      removeFromCart(item.cartItemId); 
    } else {
      updateQuantity(item.cartItemId, Math.min(newQuantity, item.stock)); 
    }
  };

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      // Store intended path to redirect after login
      navigate(RoutePath.Login, { state: { from: RoutePath.Checkout } });
    } else {
      navigate(RoutePath.Checkout);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={RoutePath.Home} className="inline-flex items-center text-indigo-600 hover:underline mb-6 text-sm group">
            <ChevronLeftIcon className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
            Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        <div className="bg-white shadow-lg rounded-lg">
          {cartItems.map(item => (
            // Use unique cartItemId as key
            <div key={item.cartItemId} className="flex items-start sm:items-center p-4 border-b border-gray-200 last:border-b-0 flex-col sm:flex-row">
              <img src={item.imageUrls[0]} alt={item.name} className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded mr-0 sm:mr-4 mb-3 sm:mb-0" />
              <div className="flex-grow mb-3 sm:mb-0">
                <Link to={RoutePath.ProductDetail.replace(':id', item.id)} className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                  {item.name}
                </Link>
                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                    <p className="text-xs text-gray-500">
                        {Object.entries(item.selectedOptions).map(([key, value]) => `${key}: ${value}`).join(', ')}
                    </p>
                )}
                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2 mx-0 sm:mx-4 mb-3 sm:mb-0">
                <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(item, item.quantity - 1)} aria-label={`Decrease quantity of ${item.name}`}>
                  <MinusIcon className="w-5 h-5" />
                </Button>
                <span className="text-md font-medium w-8 text-center tabular-nums" aria-live="polite">{item.quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(item, item.quantity + 1)} disabled={item.quantity >= item.stock} aria-label={`Increase quantity of ${item.name}`}>
                  <PlusIcon className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-md font-semibold text-gray-900 w-full sm:w-24 text-left sm:text-right mb-3 sm:mb-0">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.cartItemId)} className="ml-0 sm:ml-4 text-red-500 hover:text-red-700" aria-label={`Remove ${item.name} from cart`}>
                <TrashIcon className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <Button variant="secondary" onClick={clearCart} className="mb-4 md:mb-0" disabled={cartItems.length === 0}>
            Clear Cart
          </Button>
          <div className="text-right w-full md:w-auto">
            <p className="text-2xl font-semibold text-gray-900 mb-2" aria-live="polite">
              Total: ${getCartTotal().toFixed(2)}
            </p>
            <Button variant="primary" size="lg" className="w-full md:w-auto" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </Button>
            {!currentUser && (
                <p className="text-sm text-red-600 mt-2">Please <Link to={RoutePath.Login} state={{ from: RoutePath.Checkout }} className="font-semibold underline hover:text-red-700">login</Link> to proceed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

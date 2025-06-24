import React, { createContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { Product, CartItem, CartContextType } from '../types';

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity: number = 1, selectedOptions?: { [key: string]: string }) => {
    setCartItems(prevItems => {
      // For V1, we'll assume product.id is unique enough for cart items.
      // A more robust solution for products with selectable options would involve generating a unique cartItemId
      // based on product.id + selectedOptions.
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock), selectedOptions: selectedOptions || item.selectedOptions }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: Math.min(quantity, product.stock), selectedOptions }];
    });
  }, []);

  // For V1, cartItemId is just product.id.
  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === cartItemId) {
          const newQuantity = Math.max(0, Math.min(quantity, item.stock));
          if (newQuantity === 0) return null; // Will be filtered out
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item !== null) as CartItem[]
    );
  }, []);
  
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
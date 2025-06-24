
import React, { createContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { Product, CartItem, CartContextType } from '../types';

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_LOCAL_STORAGE_KEY = 'modernstore-cart';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  const generateCartItemId = useCallback((productId: string, options?: { [key: string]: string }): string => {
    if (!options || Object.keys(options).length === 0) {
      return productId;
    }
    // Create a stable string from options: sort keys to ensure consistent order, then join
    const sortedOptionsString = Object.keys(options)
      .sort()
      .map(key => `${key}:${options[key]}`)
      .join('|');
    return `${productId}-${sortedOptionsString}`;
  }, []);


  const addToCart = useCallback((product: Product, quantity: number = 1, selectedOptions?: { [key: string]: string }) => {
    const cartItemId = generateCartItemId(product.id, selectedOptions);
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } // stock check here
            : item
        );
      }
      return [...prevItems, { 
        ...product, 
        cartItemId, 
        quantity: Math.min(quantity, product.stock), // stock check here
        selectedOptions 
      }];
    });
  }, [generateCartItemId]);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = Math.max(0, Math.min(quantity, item.stock)); // Ensure not exceeding stock
          if (newQuantity === 0) return null; // Signal to filter out
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item !== null) as CartItem[] // Type assertion after filtering nulls
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
    generateCartItemId,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount, generateCartItemId]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

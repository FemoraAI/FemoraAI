import React, { createContext, useContext, useState } from 'react';

// Create a Context for the cart
const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  const addToCart = (item) => {
    setCartItems((prevItems) => ({
      ...prevItems,
      [item]: (prevItems[item] || 0) + 1,
    }));
  };

  const removeFromCart = (item) => {
    setCartItems((prevItems) => {
      const newQuantity = (prevItems[item] || 0) - 1;
      if (newQuantity <= 0) {
        const { [item]: _, ...rest } = prevItems; // Remove item if quantity is zero
        return rest;
      }
      return {
        ...prevItems,
        [item]: newQuantity,
      };
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext);
};

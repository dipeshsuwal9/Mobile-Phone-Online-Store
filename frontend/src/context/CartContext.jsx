import { createContext, useState, useEffect, useContext } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productType, productId, quantity = 1) => {
    const data = await cartService.addToCart(productType, productId, quantity);
    setCart(data);
    return data;
  };

  const updateCartItem = async (cartItemId, quantity) => {
    const data = await cartService.updateCartItem(cartItemId, quantity);
    setCart(data);
    return data;
  };

  const removeFromCart = async (cartItemId) => {
    const data = await cartService.removeFromCart(cartItemId);
    setCart(data);
    return data;
  };

  const clearCart = async () => {
    const data = await cartService.clearCart();
    setCart(data);
    return data;
  };

  const refreshCart = () => {
    fetchCart();
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    itemCount: cart?.total_items || 0,
    totalAmount: cart?.total_amount || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

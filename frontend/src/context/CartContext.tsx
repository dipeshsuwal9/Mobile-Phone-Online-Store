import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { cartService } from "../services/cartService";
import { Cart } from "../types";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (
    productType: "PHONE" | "ACCESSORY",
    productId: number,
    quantity: number
  ) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshCart = async (): Promise<void> => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      refreshCart();
    }
  }, []);

  const addToCart = async (
    productType: "PHONE" | "ACCESSORY",
    productId: number,
    quantity: number
  ): Promise<void> => {
    try {
      setLoading(true);
      const updatedCart = await cartService.addToCart({
        product_type: productType,
        product_id: productId,
        quantity,
      });
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    itemId: number,
    quantity: number
  ): Promise<void> => {
    try {
      setLoading(true);
      const updatedCart = await cartService.updateCartItem(itemId, {
        quantity,
      });
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number): Promise<void> => {
    try {
      setLoading(true);
      await cartService.removeFromCart(itemId);
      await refreshCart();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setCart(null);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const totalItems =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalAmount =
    cart?.items.reduce(
      (sum, item) => sum + parseFloat(item.subtotal || "0"),
      0
    ) || 0;

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
    totalItems,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

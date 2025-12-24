import api from "./api";
import { Cart } from "../types";

interface AddToCartData {
  product_type: "PHONE" | "ACCESSORY";
  product_id: number;
  quantity: number;
}

interface UpdateCartItemData {
  quantity: number;
}

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get("/cart/");
    return response.data;
  },

  async addToCart(data: AddToCartData): Promise<Cart> {
    const response = await api.post("/cart/items/", data);
    return response.data;
  },

  async updateCartItem(
    itemId: number,
    data: UpdateCartItemData
  ): Promise<Cart> {
    const response = await api.patch(`/cart/items/${itemId}/`, data);
    return response.data;
  },

  async removeFromCart(itemId: number): Promise<void> {
    await api.delete(`/cart/items/${itemId}/`);
  },

  async clearCart(): Promise<void> {
    await api.delete("/cart/clear/");
  },
};

export default cartService;

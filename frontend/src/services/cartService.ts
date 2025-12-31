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
    const response = await api.get("/cart/my_cart/");
    return response.data;
  },

  async addToCart(data: AddToCartData): Promise<Cart> {
    const response = await api.post("/cart/add_item/", data);
    return response.data;
  },

  async updateCartItem(
    itemId: number,
    data: UpdateCartItemData
  ): Promise<Cart> {
    const response = await api.patch("/cart/update_item/", {
      cart_item_id: itemId,
      ...data,
    });
    return response.data;
  },

  async removeFromCart(itemId: number): Promise<void> {
    await api.delete("/cart/remove_item/", {
      params: { cart_item_id: itemId },
    });
  },

  async clearCart(): Promise<void> {
    await api.delete("/cart/clear_cart/");
  },
};

export default cartService;

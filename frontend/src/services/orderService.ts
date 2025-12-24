import api from "./api";
import { Order, PaginatedResponse } from "../types";

interface CreateOrderData {
  shipping_address: string;
}

export const orderService = {
  async getAllOrders(): Promise<PaginatedResponse<Order>> {
    const response = await api.get("/orders/");
    return response.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  async createOrderFromCart(data: CreateOrderData): Promise<Order> {
    const response = await api.post("/orders/from-cart/", data);
    return response.data;
  },

  async cancelOrder(id: number): Promise<Order> {
    const response = await api.post(`/orders/${id}/cancel/`);
    return response.data;
  },
};

export default orderService;

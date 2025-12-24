import api from "./api";
import { Payment } from "../types";

interface CreatePaymentData {
  order: number;
  amount: string;
  payment_method:
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "UPI"
    | "NET_BANKING"
    | "CASH_ON_DELIVERY";
}

export const paymentService = {
  async createPayment(data: CreatePaymentData): Promise<Payment> {
    const response = await api.post("/payments/", data);
    return response.data;
  },

  async getPaymentById(id: number): Promise<Payment> {
    const response = await api.get(`/payments/${id}/`);
    return response.data;
  },

  async getPaymentByOrderId(orderId: number): Promise<Payment> {
    const response = await api.get(`/payments/by-order/${orderId}/`);
    return response.data;
  },
};

export default paymentService;

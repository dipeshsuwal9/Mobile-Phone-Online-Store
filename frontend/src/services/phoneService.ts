import api from "./api";
import { MobilePhone, Brand, PaginatedResponse } from "../types";

export const phoneService = {
  async getAllPhones(params?: {
    search?: string;
    brand?: string;
  }): Promise<PaginatedResponse<MobilePhone>> {
    const response = await api.get("/phones/", {
      params: { ...params, _t: Date.now() },
    });
    return response.data;
  },

  async getPhoneById(id: number): Promise<MobilePhone> {
    const response = await api.get(`/phones/${id}/`, {
      params: { _t: Date.now() },
    });
    return response.data;
  },

  async getAllBrands(): Promise<Brand[]> {
    const response = await api.get("/brands/");
    return response.data;
  },

  async getBrandById(id: number): Promise<Brand> {
    const response = await api.get(`/brands/${id}/`);
    return response.data;
  },
};

export default phoneService;

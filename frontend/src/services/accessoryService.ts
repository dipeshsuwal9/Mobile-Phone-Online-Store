import api from "./api";
import { Accessory, PaginatedResponse } from "../types";

export const accessoryService = {
  async getAllAccessories(params?: {
    search?: string;
    type?: string;
  }): Promise<PaginatedResponse<Accessory>> {
    const response = await api.get("/accessories/", {
      params: { ...params, _t: Date.now() },
    });
    return response.data;
  },

  async getAccessoryById(id: number): Promise<Accessory> {
    const response = await api.get(`/accessories/${id}/`, {
      params: { _t: Date.now() },
    });
    return response.data;
  },
};

export default accessoryService;

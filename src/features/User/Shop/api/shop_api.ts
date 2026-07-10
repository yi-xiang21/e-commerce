import { callAPI } from "@/share/lib/axios";
import { API_CONFIG } from "@/config/api";

export const ShopApi = {
  getCategories: async () => {
    return callAPI.get(API_CONFIG.ENDPOINTS.GET_CATEGORIES);
  },
  getProducts: async (params: {
    page: number;
    limit: number;
    type_id?: string | number; 
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) => {
    return callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCTS, { params });
  },
};

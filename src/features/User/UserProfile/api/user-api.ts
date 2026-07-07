import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { user } from "@/features/Auth/types/auth-type";

export const userApi = {
  getProfile: async () => {
    return callAPI.get(API_CONFIG.ENDPOINTS.PROFILE);
  },
  updateProfile: async (data: user) => {
    return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, data);
  },
  getOrderHistory: async (page: number = 1, tab: string, type: string) => {
    return callAPI.get(`${API_CONFIG.ENDPOINTS.GET_ORDER_HISTORY}?page=${page}&tab=${tab}&type=${type}`);
  },
  getOrderDetail: async (id: string) => {
    return callAPI.get(API_CONFIG.ENDPOINTS.GET_ORDER_DETAIL(id));
  }
}
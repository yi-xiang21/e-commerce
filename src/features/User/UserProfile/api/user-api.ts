import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";

export const userApi = {
  getProfile: async () => {
    return callAPI.get(API_CONFIG.ENDPOINTS.PROFILE);
  },
  updateProfile: async (data: FormData) => {
    return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, data);
  }
}
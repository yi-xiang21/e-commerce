import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { user } from "@/features/Auth/types/auth-type";

export const userApi = {
  getProfile: async () => {
    return callAPI.get(API_CONFIG.ENDPOINTS.PROFILE);
  },
  updateProfile: async (data: user) => {
    return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, data);
  }
}
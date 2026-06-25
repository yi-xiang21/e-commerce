import { type LoginResponse, type LoginPayload, type RegisterPayload } from '@/features/auth/types/auth-type'
import { API_CONFIG } from "@/config/api";
import {callAPI} from "@/share/lib/axios";

const authApi = {
  login: async (payload: LoginPayload) => {
    return callAPI.post<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, payload);
  },
  register: async (payload: RegisterPayload) => {
    return callAPI.post(API_CONFIG.ENDPOINTS.REGISTER, payload);
  },
  getGoogleLoginUrl: () => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GOOGLE_LOGIN}`;
  },
  logout: async () => {
    const req = callAPI.post(API_CONFIG.ENDPOINTS.LOGOUT);
    return req;
  },
  getProfile: async () => {
    return callAPI.get(
        API_CONFIG.ENDPOINTS.PROFILE
    );
  }
}


export { authApi };
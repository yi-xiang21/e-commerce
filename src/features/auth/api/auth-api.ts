import {
  type LoginResponse,
  type LoginPayload,
  type RegisterPayload,
  type ForgotPasswordPayload,
  type VerifyOtpPayload,
  type ResetPasswordPayload
} from '@/features/Auth/types/auth-type'
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
  },
  forgotPassword: async (payload: ForgotPasswordPayload) => {
    return callAPI.post(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, payload);
  },
  verifyOtp: async (payload: VerifyOtpPayload) => {
    return callAPI.post(API_CONFIG.ENDPOINTS.VERIFY_OTP, payload);
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    return callAPI.post(API_CONFIG.ENDPOINTS.RESET_PASSWORD, payload);
  },
}


export { authApi };
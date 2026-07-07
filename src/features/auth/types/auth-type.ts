export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: {
        user_id: string;
        role: string;
        loyalty_points?: number;
    };
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    phone_number: string;
    role: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
    message: string;
    reset_session_token: string;
}

export interface ResetPasswordPayload {
    email: string;
  new_password: string;
  reset_session_token: string;
}

export type user = {
  user_id: string;
  username?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  loyalty_points?: number;
}
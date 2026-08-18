import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@/features/Auth/api/auth-api'
import type { changePasswordPayload, ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload, VerifyOtpPayload } from '@/features/Auth/types/auth-type';

const getErrorMessage = (error: any, fallback: string) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.message) return error.message;
  return fallback;
};

export const loginThunk = createAsyncThunk(
  'api/auth/login',
  async (payload: LoginPayload, thunkAPI) => {
    try {
      const response = await authApi.login(payload);
      const data = (response as { data?: any }).data ?? response;

      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Đăng nhập thất bại')
      );
    }
  },
);

export const registerThunk = createAsyncThunk(
  'api/auth/register',
  async (payload: RegisterPayload, thunkAPI) => {
    try {
      const res = await authApi.register(payload);

      return (res as { data?: unknown }).data ?? res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Đăng ký tài khoản thất bại'),
      );
    }
  },
);

export const getMeThunk = createAsyncThunk('/api/auth/me', async (_, thunkAPI) => {
  try {
    const { getProfile } = authApi
    const res = await getProfile();

    return (res as { data?: unknown }).data ?? res;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, 'Lấy thông tin người dùng thất bại')
    );
  }
});

export const logoutThunk = createAsyncThunk(
  'api/auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.logout();

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Đăng xuất thất bại"
      );
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'api/auth/forgot-password',
  async (payload: ForgotPasswordPayload, thunkAPI) => {
    try {
      const response = await authApi.forgotPassword(payload);
      return (response as { data?: any }).data ?? response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Quên mật khẩu thất bại')
      );
    }
  },
);

export const verifyOtpThunk = createAsyncThunk(
  'api/auth/verify-reset-otp',
  async (payload: VerifyOtpPayload, thunkAPI) => {
    try {
      const response = await authApi.verifyOtp(payload);
      return (response as { data?: any }).data ?? response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Xác thực OTP thất bại')
      );
    }
  },
);

export const resetPasswordThunk = createAsyncThunk(
  'api/auth/reset-password',
  async (payload: ResetPasswordPayload, thunkAPI) => {
    try {
      const response = await authApi.resetPassword(payload);
      return (response as { data?: any }).data ?? response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Reset mật khẩu thất bại')
      );
    }
  },
);

export const changePasswordThunk = createAsyncThunk(
  'api/auth/chagePassword',
  async (payload: changePasswordPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đôi mật khẩu thất bại!');
    }
  }
)
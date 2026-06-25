import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@/features/Auth/api/auth-api'
import type { LoginPayload, RegisterPayload } from '../types/auth-type';

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
import { createSlice } from '@reduxjs/toolkit';

import { getMeThunk, loginThunk, logoutThunk, registerThunk } from '@/features/Auth/store/auth-thunk';
import type { user } from '@/features/Auth/types/auth-type';

type AuthState = {
  user: user | null;
  initialized: boolean; // Dùng để đánh dấu đã kiểm tra token và lấy thông tin user hay chưa
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  initialized: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    markInitialized: (state) => {
      state.initialized = true;
    },
  },

  extraReducers: (builder) => {
    builder
    .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    .addCase(logoutThunk.fulfilled, (state) => {
      state.loading = false;

      state.user = null;
      state.error = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    })
    .addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;

      localStorage.setItem('accessToken', action.payload.access_token);
      localStorage.setItem('refreshToken', action.payload.refresh_token);

    })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Đăng nhập thất bại';
      })

      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Đăng ký thất bại';
      })

      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload as user;

        state.initialized = true;
      })
      .addCase(getMeThunk.rejected, (state, action) => {
        state.loading = false;

        state.user = null;

        state.initialized = true;

        state.error = typeof action.payload === 'string' ? action.payload : 'Lấy thông tin người dùng thất bại';
      })
      
  },
});

export const { logout, clearError, markInitialized } = authSlice.actions;

export default authSlice.reducer;
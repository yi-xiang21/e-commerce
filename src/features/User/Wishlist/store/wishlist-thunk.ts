// src/features/User/Wishlist/store/wishlist-thunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { WishlistApi } from '../api/wishlist_api';

export const fetchWishlistThunk = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      const res = await WishlistApi.getAll();
      // Tùy chỉnh theo format response thực tế, thường là res.data.data
      return res.data?.data || res.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Lấy danh sách yêu thích thất bại'
      );
    }
  }
);

export const toggleWishlistThunk = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId: string | number, thunkAPI) => {
    try {
      await WishlistApi.toggleWishlist(productId);
      
      // Trả về productId để Slice biết cần xóa sản phẩm nào khỏi giao diện
      return productId; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Thao tác với danh sách yêu thích thất bại'
      );
    }
  }
);
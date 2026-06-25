import { createAsyncThunk } from '@reduxjs/toolkit';
import { WishlistApi } from '../api/wishlist_api';

export const fetchWishlistThunk = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      const res = await WishlistApi.getAll();
      
      // Bóc tách chính xác mảng items từ response của bạn
      const itemsArray = res.data?.items || res.data?.data?.items || []
      
      console.log('Fetched wishlist items:', itemsArray); // Debug log
      
      return itemsArray; // CHỈ TRẢ VỀ MẢNG, KHÔNG TRẢ VỀ OBJECT
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
      return productId; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Thao tác với danh sách yêu thích thất bại'
      );
    }
  }
);
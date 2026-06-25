import { createSlice } from '@reduxjs/toolkit';
import { fetchWishlistThunk, toggleWishlistThunk } from './wishlist-thunk';
import type { WishlistState } from '../type/wishlist';

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchWishlistThunk
      .addCase(fetchWishlistThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Gán thẳng mảng từ thunk vào state
        state.items = action.payload; 
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Xử lý toggleWishlistThunk
      .addCase(toggleWishlistThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleWishlistThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.product_id !== action.payload);
      })
      .addCase(toggleWishlistThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
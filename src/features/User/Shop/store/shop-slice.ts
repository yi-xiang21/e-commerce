import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; 
import type { ShopState } from "../types/shop";
import { fetchCategoriesThunk, fetchProductsThunk } from "./shop-thunk";

const initialState: ShopState = {
  products: [],
  categories: [], 
  isLoading: false,
  error: null,
  filters: {
    selectedCategory: "all",
    minPrice: 0,
    maxPrice: 2000000,
    sortBy: "price_asc",
    currentPage: 1,
    totalPages: 1,
  },
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    updateFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filters.currentPage = 1; 
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.filters.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý nạp danh sách sản phẩm
      .addCase(fetchProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || [];
        state.filters.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Xử lý nạp danh mục động (Hết lỗi đỏ giao diện)
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload || []; 
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateFilters, setCurrentPage } = shopSlice.actions;
export default shopSlice.reducer;
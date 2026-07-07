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
    // 1. Thay đổi bộ lọc (Category, Giá...) thì đưa người dùng về trang 1
    updateFilters: (state, action: PayloadAction<Partial<Omit<typeof initialState.filters, "currentPage" | "totalPages">>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filters.currentPage = 1; 
    },
    // 2. Chuyển trang thì cập nhật thẳng số trang, ko reset về 1
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.filters.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || [];
        state.filters.totalPages = action.payload.totalPages; 
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categories = action.payload || []; 
      });
  },
});

export const { updateFilters, setCurrentPage } = shopSlice.actions;
export default shopSlice.reducer;
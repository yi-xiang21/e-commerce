import { createSlice } from '@reduxjs/toolkit';
import type { ICartState } from '../type/cart-type';
import { getLocalCart } from '@/features/Cart/constants/local-cart';
import { addToCartThunk, fetchCart, updateItemQuantity, removeCartItem, syncLocalCart, addProductToCartThunk } from './cart-thunk';

const initialState: ICartState = {
    items: [],
    isLoading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Hàm này dùng để xóa state giỏ hàng khi người dùng Logout
        clearCartState: (state) => {
            state.items = [];
            state.error = null;
        },
        loadLocalCart: (state) => {
            state.items = getLocalCart();
        },
        updateItemDiscount: (state, action) => {
            const { variant_id, discount, final_price } = action.payload;
            const item = state.items.find(i => i.variant_id === variant_id);
            if (item) {
                item.discount = discount || null;
                item.final_price = final_price || null;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCartThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCartThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const item = action.payload;
                const existing = state.items.find(i => i.variant_id === item.variant_id);
                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    state.items.push(item);
                }
            })
            .addCase(addToCartThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Xử lý luồng lấy giỏ hàng
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Xử lý luồng đồng bộ giỏ hàng
            .addCase(syncLocalCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(syncLocalCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(syncLocalCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Hiển thị lỗi nếu update hoặc xóa thất bại
            .addCase(updateItemQuantity.fulfilled, (state, action) => {
                const { variant_id, quantity } = action.payload;
                // Tìm đúng sản phẩm và cập nhật số lượng mới
                const existingItem = state.items.find(item => item.variant_id === variant_id);
                if (existingItem) {
                    existingItem.quantity = quantity;
                }
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                const variant_id = action.payload;
                // Lọc bỏ sản phẩm đã xóa khỏi mảng
                state.items = state.items.filter(item => item.variant_id !== variant_id);
            })
            .addCase(addProductToCartThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addProductToCartThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const { product } = action.payload;
                if (product?.variants?.[0]) {
                    const variant = product.variants[0];
                    const existingItem = state.items.find(i => i.variant_id === variant.variant_id);
                    if (existingItem) {
                        existingItem.discount = variant.discount || null;
                        existingItem.final_price = variant.final_price || null;
                    }
                }
            })
            .addCase(addProductToCartThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    },
});

export const { clearCartState, loadLocalCart, updateItemDiscount } = cartSlice.actions;
export default cartSlice.reducer;
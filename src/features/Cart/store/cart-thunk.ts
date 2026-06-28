import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../api/cart-api';
import type { ISyncCartPayload } from '../type/cart-type';

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const {data}: any = await cartApi.getCart();
            return data.cart;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi tải giỏ hàng');
        }
    }
);

export const updateItemQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ variant_id, quantity }: { variant_id: number; quantity: number }, {  rejectWithValue }) => {
        try {
            await cartApi.updateQuantity(variant_id, quantity);
            return { variant_id, quantity };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi cập nhật số lượng');
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeItem',
    async (variant_id: number, { rejectWithValue }) => {
        try {
            await cartApi.removeFromCart(variant_id);
            return variant_id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi xóa sản phẩm');
        }
    }
);

export const syncLocalCartToServer = createAsyncThunk(
    'cart/syncCart',
    async (local_cart: ISyncCartPayload[], { rejectWithValue }) => {
        try {
            await cartApi.syncCart(local_cart);
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi đồng bộ giỏ hàng');
        }
    }
);
import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../api/cart-api';
import type { ISyncCartPayload, ICartItem } from '../type/cart-type';
import { getLocalCart, addToLocalCart, updateLocalQuantity, removeFromLocalCart } from '@/share/lib/local-cart';
import type { RootState } from '@/app/redux/store';

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        if (!state.auth.user) {
            return getLocalCart();
        }
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
    async ({ variant_id, quantity }: { variant_id: number; quantity: number }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        if (!state.auth.user) {
            updateLocalQuantity(variant_id, quantity);
            return { variant_id, quantity };
        }
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
    async (variant_id: number, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        if (!state.auth.user) {
            removeFromLocalCart(variant_id);
            return variant_id;
        }
        try {
            await cartApi.removeFromCart(variant_id);
            return variant_id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi xóa sản phẩm');
        }
    }
);

export const addToCartThunk = createAsyncThunk(
    'cart/addToCart',
    async (item: ICartItem, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        if (state.auth.user) {
            try {
                await cartApi.addToCart(item.variant_id, item.quantity);
                return item;
            } catch (error: any) {
                return rejectWithValue(error.response?.data?.message || 'Lỗi thêm vào giỏ hàng');
            }
        } else {
            addToLocalCart(item);
            return item;
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
import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../api/cart-api';
import { callAPI } from '@/share/lib/axios';
import { API_CONFIG } from '@/config/api';
import type { ISyncCartPayload, ICartItem } from '../type/cart-type';
import { getLocalCart, addToLocalCart, updateLocalQuantity, removeFromLocalCart } from '@/features/Cart/constants/local-cart';
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
            // Return post-merge item from localStorage to keep Redux in sync
            const stored = getLocalCart().find(i => i.variant_id === item.variant_id);
            return stored || item;
        }
    }
);

export const syncLocalCart = createAsyncThunk(
    'cart/syncCart',
    async (local_cart: ISyncCartPayload[], { rejectWithValue }) => {
        try {
            const result: any = await cartApi.syncCart(local_cart);
            // Backend trả về { success, data: { cart: [...] } }
            // Axios interceptor unwraps response.data, nên result = response body
            return result.data.cart as ICartItem[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi đồng bộ giỏ hàng');
        }
    }
);

export const addProductToCartThunk = createAsyncThunk(
    'cart/addProductToCart',
    async ({ product_id, quantity = 1 }: { product_id: number; quantity?: number }, { rejectWithValue }) => {
        try {
            // Add product to cart
            await cartApi.addToCart(product_id, quantity);
            
            // Fetch product details to get discount info
            const productRes: any = await callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCT(String(product_id)));
            const product = productRes.data?.product || productRes.product;
            
            return { product_id, product };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi thêm vào giỏ hàng');
        }
    }
);
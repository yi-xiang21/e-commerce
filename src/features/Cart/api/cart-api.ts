import { callAPI } from '@/share/lib/axios'; // Thay bằng đường dẫn instance thực tế của bạn
import { API_CONFIG } from '@/config/api';
import type { ICartItem, ISyncCartPayload } from '../type/cart-type';

export const cartApi = {
    getCart: () => {
        return callAPI.get<{ success: boolean; data: { cart: ICartItem[] } }>(
            API_CONFIG.ENDPOINTS.GET_CART
        );
    },

    addToCart: (variant_id: number, quantity: number) => {
        return callAPI.post(
            API_CONFIG.ENDPOINTS.ADD_TO_CART, 
            { variant_id, quantity }
        );
    },

    updateQuantity: (variant_id: number, quantity: number) => {
        return callAPI.put(
            API_CONFIG.ENDPOINTS.UPDATE_CART(variant_id), 
            { quantity }
        );
    },

    removeFromCart: (variant_id: number) => {
        return callAPI.delete(
            API_CONFIG.ENDPOINTS.REMOVE_FROM_CART(variant_id)
        );
    },

    syncCart: (local_cart: ISyncCartPayload[]) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.SYNC_CART, { local_cart });
    }
};
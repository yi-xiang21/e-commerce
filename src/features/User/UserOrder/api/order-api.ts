import { API_CONFIG } from "@/config/api"
import { callAPI } from "@/share/lib/axios"

export const orderApi = {
    getOrderHistory: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_ORDER_HISTORY)
    },
    getOrderDetail: async (id: string) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_ORDER_DETAIL(id))
    },
    createOrder: async (data: any) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.CREATE_ORDER, data)
    },
    repurchaseOrder: async (id: string) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.REPURCHASE_ORDER(id))
    },
    getCities: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_CITIES)
    },
    getWards: async (cityId: string) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_WARDS(cityId))
    },
    getVoucher: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_VOUCHERS)
    },
    getShippingFee: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_SHIPPING_FEE)
    },
    getCartItems: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_CART_ITEMS)
    },
    getProductById: async (id: string) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCT_BY_ID(id))
    },
    getMyVouchers: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_MY_VOUCHERS)
    },
}
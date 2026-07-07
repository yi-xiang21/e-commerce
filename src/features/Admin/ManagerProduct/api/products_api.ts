import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { Product } from "@/features/Admin/ManagerProduct/type/products";

export const ProductApi = {
    getAll: async (page :number, limit: number) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCTS, { params: { page, limit } });
    },
    getById: async (id: any) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCT( id));
    },
    create: async (data:Product) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.CREATE_PRODUCT, data);
    },
    update: async (id: any, data: Product) => {
        return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_PRODUCT(id ), data);
    },
    delete: async (id: any) => {
        return callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_PRODUCT( id));
    },
    filter: async (filter: any) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.FiLTER_PRODUCTS, filter );
    },
    getProductsTopSelling: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCTS_TOP_SELLING);
    }

}
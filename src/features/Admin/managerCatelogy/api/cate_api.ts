import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { CategoryFormValues } from "../type/catelogy";

export const categoryApi = {
    getAll: async (page :number, limit: number) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_CATEGORIES, { params: { page, limit } });
    },
    getById: async (id: string) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_CATEGORY(id));
    },
    create: async (data:CategoryFormValues) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.CREATE_CATEGORY, data);
    },
    update: async (id: string, data: CategoryFormValues) => {
        return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_CATEGORY(id), data);
    },
    delete: async (id: string) => {
        return callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_CATEGORY(id));
    },
    filter: async (filter: any) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.FiLTER_CATEGORIES, filter );
    }
}
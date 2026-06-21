import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { account } from "@/features/Admin/ManagerAccount/type/account";

// call api tuy theo API_CONFIG.ENDPOINTS tu file src/config/api.ts
export const AccountApi = {
    // api lay danh sach tai khoan, co phan trang
    getAll: async (page :number, limit: number) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GETALL_USERS, { params: { page, limit } });
    },
    // api lay thong tin chi tiet tai khoan theo id
    getById: async (id: any) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_USER( id));
    },
    // api tao moi tai khoan
    create: async (data:account) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.CREATE_USER, data);
    },
    // api cap nhat tai khoan theo id
    update: async (id: any, data: account) => {
        return callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_USER(id ), data);
    },
    // api xoa tai khoan theo id
    delete: async (id: any) => {
        return callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_USER( id));
    },
    // api loc tai khoan theo cac truong, co phan trang
    filter: async (filter: any) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.FILTER_USERS, filter );
    }
}
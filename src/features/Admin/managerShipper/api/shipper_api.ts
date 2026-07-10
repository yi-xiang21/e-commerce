import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { shipper } from "../type/shipper";

export const ShipperApi = {
    getAll: async (filterData:any) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_SHIPPER, { params: filterData });
    },
    create: async (data: shipper) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.POST_CREATE_SHIPPER, data);
    },
    updateLocation: async (shipper_id: string, data: shipper) => {
        return callAPI.put(API_CONFIG.ENDPOINTS.PUT_UPDATE_SHIPPER_LOCATION(shipper_id), data);
    },
    updateStatus: async (shipper_id: string, data: shipper) => {
        return callAPI.patch(API_CONFIG.ENDPOINTS.PATCH_UPDATE_STATUS_SHIPPER(shipper_id), data);
    },
}
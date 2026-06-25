import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";

export const OrderApi = {
  getAll: (page:number, limit:number) =>
    callAPI.get(API_CONFIG.ENDPOINTS.GETALL_ORDERS, { params:{ page, limit } }),
  getById: (id:any) =>
    callAPI.get(API_CONFIG.ENDPOINTS.GET_ORDER(id)),
  updateStatus: (id:any, data:any) =>
    callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_ORDER_STATUS(id), data),
  filter: (filter:any) =>
    callAPI.post(API_CONFIG.ENDPOINTS.FILTER_ORDERS, filter)
}
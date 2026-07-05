import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";

export const VoucherApi = {
  getAll: (page:number, limit:number) =>
    callAPI.get(API_CONFIG.ENDPOINTS.GET_VOUCHERS, { params:{ page, limit } }),
  getById: (id:any) =>
    callAPI.get(API_CONFIG.ENDPOINTS.GET_VOUCHER(id)),
  update: (id:any, data:any) =>
    callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_VOUCHER(id), data),
  filter: (filter:any) =>
    callAPI.post(API_CONFIG.ENDPOINTS.FILTER_VOUCHERS, filter),
  delete: (id:any) =>
    callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_VOUCHER(id)),
  create: (data:any) =>
    callAPI.post(API_CONFIG.ENDPOINTS.CREATE_VOUCHER, data),
}
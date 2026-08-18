import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";


export const PromotionApi = {
  getAll: (page:number, limit:number) =>
    callAPI.get(API_CONFIG.ENDPOINTS.GET_PROMOTIONS, { params:{ page, limit } }),
  getById: (id:any) =>
    callAPI.get(API_CONFIG.ENDPOINTS.GET_PROMOTION(id)),
  update: (id:any, data:any) =>
    callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_PROMOTION(id), data),
  filter: (filter:any) =>
    callAPI.post(API_CONFIG.ENDPOINTS.FILTER_PROMOTIONS, filter),
  delete: (id:any) =>
    callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_PROMOTION(id)),
  create: (data:any) =>
    callAPI.post(API_CONFIG.ENDPOINTS.CREATE_PROMOTION, data),
}
import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { ShipperProfileUpdate } from "../types/shipper";

export const ShipperPortalApi = {
  getProfile: () =>
    callAPI.get(API_CONFIG.ENDPOINTS.GET_SHIPPER_PROFILE),
  
  updateProfile: (data: ShipperProfileUpdate) => 
    callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_SHIPPER_PROFILE, data),
  
  getAvailableOrders: () => 
    callAPI.get(API_CONFIG.ENDPOINTS.GET_AVAILABLE_ORDERS),

  acceptOrder: (orderId: string) =>
    callAPI.post(API_CONFIG.ENDPOINTS.ACCEPT_ORDER(orderId)),
};
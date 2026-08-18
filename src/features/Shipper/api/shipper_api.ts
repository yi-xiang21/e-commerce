import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { ShipperProfileUpdate } from "../types/shipper";

export const ShipperPortalApi = {
  getProfile: () => callAPI.get(API_CONFIG.ENDPOINTS.GET_SHIPPER_PROFILE),

  updateProfile: (data: ShipperProfileUpdate) => callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_SHIPPER_PROFILE, data),

  getAvailableOrders: () => callAPI.get(API_CONFIG.ENDPOINTS.GET_AVAILABLE_ORDERS),

  acceptOrder: (orderId: string) => callAPI.put(API_CONFIG.ENDPOINTS.ACCEPT_ORDER(orderId)),
  
  getMyDeliveries: (status: string = '') => 
    callAPI.get(`${API_CONFIG.ENDPOINTS.GET_MY_DELIVERIES}?status=${status}`),

  getOrderDetail: (orderId: string) => 
    callAPI.get(API_CONFIG.ENDPOINTS.GET_SHIPPER_ORDER_DETAIL(orderId)),
    
  updateDeliveryStatus: (orderId: string, data: { status: string; failed_reason: string }) => 
    callAPI.put(API_CONFIG.ENDPOINTS.UPDATE_DELIVERY_STATUS(orderId), data),
};
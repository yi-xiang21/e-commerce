import { callAPI } from "@/share/lib/axios";
import { API_CONFIG } from "@/config/api";

export const ShopApi = {
  // 1. Gọi trực tiếp endpoint lấy loại sản phẩm (Thay thế cho categories cũ)
  getCategories: async () => {
    return callAPI.get(API_CONFIG.ENDPOINTS.GET_CATEGORIES);
  },

  // 2. Lấy sản phẩm gửi kèm type_id lên để backend lọc
  getProducts: async (params: {
    page: number;
    limit: number;
    type_id?: string | number; // Lọc theo type_id của bảng product_types
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) => {
    return callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCTS, { params });
  },
};

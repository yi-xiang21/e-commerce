import { callAPI } from "@/share/lib/axios";
import { API_CONFIG } from "@/config/api";

export const WishlistApi = {
  // Lấy danh sách wishlist
  getAll: async () => {
    return callAPI.get(API_CONFIG.ENDPOINTS.GET_WISHLIST); 
  },
  
  // Xóa/Thêm sản phẩm khỏi wishlist (dùng chung API Toggle)
  toggleWishlist: async (productId: string | number) => {
    return callAPI.post(API_CONFIG.ENDPOINTS.POST_WISHLIST, { productId });
  },

  // API thêm giỏ hàng (hiện tại chưa có trong API_CONFIG, tôi tạm để đường dẫn chuẩn)
  addToCart: async (productId: string | number, quantity: number = 1) => {
    return callAPI.post('/api/cart', { productId, quantity });
  }
};
import { callAPI } from "@/share/lib/axios";
import { API_CONFIG } from "@/config/api";

export const WishlistApi = {
  // Lấy danh sách wishlist
  getAll: async () => {
    return callAPI.get(API_CONFIG.ENDPOINTS.GET_WISHLIST); 
  },
  
  // Xóa/Thêm sản phẩm khỏi wishlist (dùng chung API Toggle)
  toggleWishlist: async (productId: string | number) => {
    return callAPI.post(API_CONFIG.ENDPOINTS.POST_WISHLIST, { product_id: productId });
  },

  // API thêm giỏ hàng (hiện tại chưa có trong API_CONFIG, tôi tạm để đường dẫn chuẩn)
  addToCart: async (variantId: string | number, quantity: number = 1) => {
    // Gọi đúng endpoint ADD_TO_CART và truyền payload chứa variant_id
    return callAPI.post(API_CONFIG.ENDPOINTS.ADD_TO_CART, { 
        variant_id: Number(variantId), 
        quantity 
    });
  }
};
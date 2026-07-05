export const CART_CONSTANTS = {
    // Key để lưu giỏ hàng dưới Local Storage cho khách chưa đăng nhập
    LOCAL_STORAGE_KEY: 'shoplen_guest_cart',
    
    // Giới hạn an toàn
    MAX_QUANTITY_PER_ITEM: 99,
    MIN_QUANTITY_PER_ITEM: 1,
} as const;
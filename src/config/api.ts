const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,

  ENDPOINTS: {
    //auth
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    GOOGLE_LOGIN: '/api/auth/google',
    //user
    PROFILE: '/api/auth/me',
    UPDATE_PROFILE: '/api/users/user/me',

    //whistlist
    POST_WISHLIST: '/api/wishlist/toggle',
    GET_WISHLIST: '/api/wishlist',

    //cart
    GET_CART: '/api/cart',
    ADD_TO_CART: '/api/cart',
    REMOVE_FROM_CART: (variantId: string | number) => `/api/cart/${variantId}`,
    UPDATE_CART: (variantId: string | number) => `/api/cart/${variantId}`,

    SYNC_CART: '/api/cart/sync',

    //admin account
    GETALL_USERS: '/api/users',
    GET_USER: (id: string) => `/api/users/${id}`,
    CREATE_USER: '/api/users',
    UPDATE_USER: (id: string) => `/api/users/${id}`,
    DELETE_USER: (id: number) => `/api/users/${id}`,
    FILTER_USERS: '/api/users/filter',
    
    //admin category
    GET_CATEGORIES: '/api/categories',
    GET_CATEGORY: (id: string) => `/api/categories/${id}`,
    CREATE_CATEGORY: '/api/categories',
    UPDATE_CATEGORY: (id: string) => `/api/categories/${id}`,
    DELETE_CATEGORY: (id: string) => `/api/categories/${id}`,
    FiLTER_CATEGORIES: '/api/categories/filter',

    //admin product
    GET_PRODUCTS: '/api/products',
    GET_PRODUCT: (id: string) => `/api/products/${id}`,
    CREATE_PRODUCT: '/api/products',
    UPDATE_PRODUCT: (id: string) => `/api/products/${id}`,
    DELETE_PRODUCT: (id: string) => `/api/products/${id}`,
    FiLTER_PRODUCTS: '/api/products/filter',
    GET_PRODUCTS_TOP_SELLING: '/api/products/top-selling',
    
    

    //admin voucher
    GET_VOUCHERS: '/api/vouchers/vouchers',
    GET_VOUCHER: (id: string) => `/api/vouchers/vouchers/${id}`,
    GET_MY_VOUCHERS: '/api/vouchers/my-vouchers',
    CREATE_VOUCHER: '/api/vouchers/vouchers',
    UPDATE_VOUCHER: (id: string) => `/api/vouchers/vouchers/${id}`,
    DELETE_VOUCHER: (id: string) => `/api/vouchers/vouchers/${id}`,
    FILTER_VOUCHERS: '/api/vouchers/vouchers/filter',

    //admin promotion
    GET_PROMOTIONS_ACTIVE: '/api/promotions',
    GET_PROMOTION: (id: string) => `/api/promotions/${id}`,
    GET_PROMOTIONS: '/api/promotions/promotions/all',
    CREATE_PROMOTION: '/api/promotions/promotions',
    UPDATE_PROMOTION: (id: string) => `/api/promotions/promotions/${id}`,
    DELETE_PROMOTION: (id: string) => `/api/promotions/promotions/${id}`,
    FILTER_PROMOTIONS: '/api/promotions/promotions/filter',

    //admin stock
    GET_STOCKS: '/api/variants/stock',
    GET_HISTORY_ST: (variant_id: number) => `/api/inventory/${variant_id}/history`,
    POST_UPDATE_STOCKS: '/api/inventory/adjust',
    POST_FILTER_STOCKS: '/api/inventory/overview',

    //admin order
    GETALL_ORDERS: '/api/orders/admin/all',
    GET_ORDER: (id: string) => `/api/orders/admin/${id}`,
    GET_SHIPPING_FEE: '/api/orders/shipping-fees',
    UPDATE_ORDER_STATUS: (id: string) => `/api/orders/admin/${id}/status`,
    FILTER_ORDERS: '/api/orders/admin/filter',

    //admin exchange point
    POST_LOYALTY_REWARDS: '/api/loyalty/admin/rewards',
    GET_LOYALTY_REWARDS: '/api/loyalty/admin/rewards',
    PUT_UPDATE_REWARDS: (reward_id: string) => `/api/loyalty/admin/rewards/${reward_id}/status`,
    DELETE_LOYALTY_REWARDS:(reward_id: string) => `/api/loyalty/admin/rewards/${reward_id}`,


        //admin shipper
    GET_SHIPPER:'/api/admin/shippers',
    POST_CREATE_SHIPPER:'/api/admin/shippers',
    PUT_UPDATE_SHIPPER_LOCATION: (shipper_id: string) => `/api/admin/shippers/${shipper_id}/location`,
    PATCH_UPDATE_STATUS_SHIPPER: (shipper_id: string) => `/api/admin/shippers/${shipper_id}/status`,

    // location
    GET_CITIES: '/api/location/cities',
    GET_WARDS: (cityId: string) => `/api/location/cities/${cityId}/wards`,

    // rewards voucher
    GET_HISTORY_LOYALTYPOINT:'/api/loyalty/history',
    POST_REDEEM_VOUCHER:'/api/loyalty/redeem',
    GET_CAN_REDEEM:'/api/loyalty/rewards',

    // admin shipper
    GETALL_SHIPPERS: '/api/admin/shippers',
    CREATE_SHIPPER: '/api/admin/shippers',
    UPDATE_SHIPPER_STATUS: (id: string) => `/api/admin/shippers/${id}/status`,

    //user order
    GET_ORDER_HISTORY: '/api/orders/my-orders',
    GET_ORDER_DETAIL: (id: string) => `/api/orders/my-orders/${id}`,
    CREATE_ORDER: '/api/orders',
    REPURCHASE_ORDER: (id: string) => `/api/orders/repurchase/${id}`,
    CANCEL_ORDER: (id: string | number) => `/api/orders/my-orders/${id}/cancel`,
    UPDATE_SHIPPER_LOCATION: (id: string) => `/api/admin/shippers/${id}/location`,

    // shipper portal
    GET_SHIPPER_PROFILE: '/api/shipper/profile',
    UPDATE_SHIPPER_PROFILE: '/api/shipper/profile',
    GET_AVAILABLE_ORDERS: '/api/shipper/available-orders',
    ACCEPT_ORDER: (orderId: string) => `/api/shipper/orders/${orderId}/accept`,

    //cart
    GET_CART_ITEMS: '/api/cart',
    GET_PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,

    // shipper portal
    GET_MY_DELIVERIES: '/api/shipper/my-deliveries',
    GET_SHIPPER_ORDER_DETAIL: (orderId: string) => `/api/shipper/orders/${orderId}`,
    UPDATE_DELIVERY_STATUS: (orderId: string) => `/api/shipper/orders/${orderId}/delivery-status`,


    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_OTP: '/api/auth/verify-reset-otp',
    RESET_PASSWORD: '/api/auth/reset-password',

    CHANGE_PASSWORD: '/api/users/change-password',

    REFRESH_TOKEN: '/api/auth/refresh-token',

    // admin dashboard
    ADMIN_DASHBOARD: "/api/admin/dashboard",
    GET_SALES_REVENUE: '/api/admin/dashboard/sales',
    GET_ORDER_STATISTICS: '/api/admin/dashboard/orders',
    GET_TOP_CUSTOMERS: '/api/admin/dashboard/top-customers',
    GET_TOP_PRODUCTS: '/api/admin/dashboard/top-products',
    GET_REVENUE_TREND: '/api/admin/dashboard/revenue-trend',
  },
} as const;

export type EndpointKey = keyof typeof API_CONFIG.ENDPOINTS;
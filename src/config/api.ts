const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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


    //admin account
    GETALL_USERS: '/api/users',
    GET_USER: (id: string) => `/api/users/${id}`,
    CREATE_USER: '/api/users',
    UPDATE_USER: (id: string) => `/api/users/${id}`,
    DELETE_USER: (id: string) => `/api/users/${id}`,
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
    
    

    //admin voucher
    GET_VOUCHERS: '/api/vouchers/vouchers',
    GET_VOUCHER: (id: string) => `/api/vouchers/vouchers/${id}`,
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




    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_OTP: '/api/auth/verify-reset-otp',
    RESET_PASSWORD: '/api/auth/reset-password',

    CHANGE_PASSWORD: '/api/users/change-password',

    REFRESH_TOKEN: '/api/auth/refresh-token',
  },
} as const;

export type EndpointKey = keyof typeof API_CONFIG.ENDPOINTS;
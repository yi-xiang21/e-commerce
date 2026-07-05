import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from '@/features/User/Wishlist/store/wishlist-slice';
import authReducer from '@/features/Auth/store/auth-slice';
import cartReducer from '@/features/Cart/store/cart-slice';
import shopReducer from '@/features/User/Shop/store/shop-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    shop: shopReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
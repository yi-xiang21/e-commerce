import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from '@/features/User/Wishlist/store/wishlist-slice';
import authReducer from '@/features/auth/store/auth-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
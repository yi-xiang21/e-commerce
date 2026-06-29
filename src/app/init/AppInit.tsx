import { useEffect } from 'react';
import { useAppDispatch } from "../redux/hooks";
import { getMeThunk } from '@/features/Auth/store/auth-thunk';
import { markInitialized } from '@/features/Auth/store/auth-slice';
import { hasLocalItems, getLocalSyncPayload, clearLocalCart } from '@/features/Cart/constants/local-cart';
import { syncLocalCart, fetchCart } from '@/features/Cart/store/cart-thunk';
import { loadLocalCart } from '@/features/Cart/store/cart-slice';

export default function AppInit({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      dispatch(getMeThunk()).then(() => {
        if (hasLocalItems()) {
          dispatch(syncLocalCart(getLocalSyncPayload())).then(() => {
            // Sync response đã trả về full cart, reducer đã set state.items
            clearLocalCart();
          });
        } else {
          dispatch(fetchCart());
        }
      });
    } else {
      dispatch(loadLocalCart());
      dispatch(markInitialized());
    }
  }, [dispatch]);

  return children;
}
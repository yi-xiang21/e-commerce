import { useEffect } from 'react';
import { useAppDispatch } from "../redux/hooks";
import { getMeThunk } from '@/features/Auth/store/auth-thunk';
import { markInitialized } from '@/features/Auth/store/auth-slice';

export default function AppInit({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      dispatch(getMeThunk());
    } else {
      dispatch(markInitialized());
    }
  }, [dispatch]);

  return children;
}
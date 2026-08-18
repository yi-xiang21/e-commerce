import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '@/app/redux/hooks';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireShipper?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAuth = true, requireAdmin = false, requireShipper = false }) => {
  const { user, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) {
    return (
      <Spin
        size="large"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      />
    );
  }

  // Route cần login
  if (requireAuth && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Route auth (login / register)
  if (!requireAuth && user) {
        return <Navigate to="/" replace />;
  }

  if (requireAdmin) {
    if (!user) {
      return <Navigate to="/auth/login" replace />;
    }

    if (user.role !== 'admin') {
      return <Navigate to="/profile" replace />;
    }
  }

  if (requireShipper) {
    if (!user) {
      return <Navigate to="/auth/login" replace />;
    }
    if (user.role !== 'shipper') {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
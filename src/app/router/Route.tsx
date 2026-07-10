import { createBrowserRouter } from 'react-router-dom';
import UserLayout from '@/layout/UserLayout';
import HomePage from '@/features/Home';
import AdminLayout from '@/layout/AdminLayout';
import AdminManagerAccount from '@/features/Admin/ManagerAccount/pages/AdminManagerAccount';
import AdminManagerOrder from '@/features/Admin/ManagerOrder/pages/AdminManagerOrder';
import WishlistPage from '@/features/User/Wishlist/pages/WishlistPage';
import ProtectedRoute from './ProtectedRoute';
import AuthPage from '@/features/Auth/pages/AuthPage';
import AboutPage from '@/features/User/Pages/Page/About';
import DetailPage from '@/features/User/Pages/Page/Detail';
import UserProfileLayout from '@/layout/UserProfileLayout';
import ProfileUser from '@/features/User/UserProfile/pages/ProfileUser';
import UserOrderTracking from '@/features/User/UserProfile/pages/UserOrderTracking';
import PurchaseHistoryPage from '@/features/User/UserProfile/pages/PurchaseHistory';
import DetailPurchaseHistory from '@/features/User/UserProfile/pages/DetailPurchaseHistory';
import WorkshopPage from '@/features/User/UserProfile/pages/UserWorkshop';
import ChangePassword from '@/features/User/UserProfile/pages/UserSettingAccount';
// import AuthPage from '@/features/Auth/pages/AuthPage';
import CartPage from '@/features/Cart/pages/CartPage';
import AdminManagerPromotion from '@/features/Admin/ManagerPromotion/pages/AdminManagerPromotion';
import AdminManagerVoucher from '@/features/Admin/ManagerVoucher/pages/AdminManagerVoucher';
import AdminManagerProduct from '@/features/Admin/ManagerProduct/pages/AdminManagerProduct';
import AdminManagerCatelogries from '@/features/Admin/managerCatelogy/pages/AdminManagerCatelogries';
import ShipperLayout from '@/layout/ShipperLayout';
import ShipperProfile from '@/features/Shipper/pages/ShipperProfile';
import AvailableOrders from '@/features/Shipper/pages/AvailableOrders';
import ShipperSetting from '@/features/Shipper/pages/ShipperSetting';
import ForgotPasswordPage from '@/component/ForgotPasswordPage';
import VerifyOtpPage from '@/component/VerifyOtpPage';
import ResetPasswordPage from '@/component/ResetPasswordPage';
import AdminSetting from '@/features/Admin/setting/AdminSetting';
import UserOrder from '@/features/User/UserOrder/pages/UserOrder';
import OrderSuccess from '@/features/User/UserOrder/pages/OrderSuccess';
import ShopPage from '@/features/User/Shop/pages/ShopPage';
import AdminManagerStock from '@/features/Admin/managerStock/pages/AdminManagerStock';
import OrderDetail from '@/features/Shipper/pages/OrderDetail';
import MyDeliveries from '@/features/Shipper/pages/MyDeliveries';
import DeliveryHistory from '@/features/Shipper/pages/DeliveryHistory';
import AdminManagerRewards from '@/features/Admin/managerExchangePoint/pages/AdminManagerRewards';
import AdminManagerShipper from '@/features/Admin/managerShipper/pages/AdminManagerShipper';

export const routes = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/about',
                element: <AboutPage />,
            },
            {
                path: 'detail/:id',
                element: <DetailPage />,
            },
            {
                path: "/cart",
                element: <CartPage />,
            },
            {
                path: "/shop",
                element: <ShopPage />,
            }
        ],
    },
    {
    element: <ProtectedRoute requireAuth={true} requireAdmin={true} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
                    {
                        path: 'Manager-Account',
                        element: <AdminManagerAccount />,
                    },
                    {
                        path: 'Manager-Order',
                        element: <AdminManagerOrder />,
                    },
                    {
                        path: 'Manager-Product',
                        element: <AdminManagerProduct />,
                    },
                    {
                        path: 'Manager-Promotion',
                        element: <AdminManagerPromotion />,
                    },
                    {
                        path: 'Manager-Categories',
                        element: <AdminManagerCatelogries />,
                    },
                    {
                        path: 'Manager-Voucher',
                        element: <AdminManagerVoucher />,
                    },
                    {
                        path: 'Manager-Stock',
                        element: <AdminManagerStock />,
                    },
                    {
                        path: 'Setting',
                        element: <AdminSetting />
                    },
                    {
                        path: 'Manager-Rewards',
                        element: <AdminManagerRewards />,
                    },
                    {
                        path: 'Manager-Shipper',
                        element: <AdminManagerShipper />,
                    }
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute requireAuth={true} requireShipper={true} />,
        children: [
            {
                path: '/shipper',
                element: <ShipperLayout />,
                children: [
                    {
                        path: 'profile',
                        element: <ShipperProfile />,
                    },
                    {
                        path: 'available-orders',
                        element: <AvailableOrders />,
                    },
                    { 
                        path: 'my-deliveries', 
                        element: <MyDeliveries /> 
                    },
                    {
                        path: 'delivery-history',
                        element: <DeliveryHistory />,
                    },
                    { 
                        path: 'orders/:id', 
                        element: <OrderDetail /> },
                    {
                        path: 'setting',
                        element: <ShipperSetting />
                    }
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute requireAuth={true} />,
        children: [
            {
                path: '/',
                element: <UserLayout />,
                children: [
                    {
                        path: 'profile',
                        element: <UserProfileLayout />,
                        children: [
                            {
                                index: true,
                                element: <ProfileUser />,
                            },
                            {
                                path: 'order-tracking',
                                element: <UserOrderTracking />,
                            },
                            {
                                path: 'purchase-history',
                                element: <PurchaseHistoryPage />,
                            },
                            {
                                path: 'workshop',
                                element: <WorkshopPage />,
                            },
                            {
                                path: 'account',
                                element: <WorkshopPage />,
                            },
                            {
                                path: 'change-password',
                                element: <ChangePassword />,
                            },
                            {
                                path: 'order-detail/:id',
                                element: <DetailPurchaseHistory />,
                            },
                        ],
                    },
                    {
                        path: "/wishlist",
                        element: <WishlistPage />,
                    },
                    {
                        path: "/order",
                        element: <UserOrder />,
                    },
                    {
                        path: "/order-success",
                        element: <OrderSuccess />,
                    }
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute requireAuth={false} />,
        children: [
            {
                path: '/auth',
                element: <UserLayout />,
                children: [
                    {
                        path: 'login',
                        element: <AuthPage />,
                    },
                    {
                        path: 'register',
                        element: <AuthPage />,
                    },
                    {
                        path: 'forgot-password',
                        element: <ForgotPasswordPage />,
                    },
                    {
                        path: 'verify-otp',
                        element: <VerifyOtpPage />,
                    },
                    {
                        path: 'reset-password',
                        element: <ResetPasswordPage />,
                    },
                ],
            }
        ]
    }
]);
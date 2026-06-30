import { createBrowserRouter } from 'react-router-dom';
import UserLayout from '@/layout/UserLayout';
import HomePage from '@/features/Home';
import AdminLayout from '@/layout/AdminLayout';
import AdminManagerAccount from '@/features/Admin/ManagerAccount/pages/AdminManagerAccount';
import AdminManagerOrder from '@/features/Admin/ManagerOrder/pages/AdminManagerOrder';
import WishlistPage from '@/features/User/Wishlist/pages/WishlistPage';
import ProtectedRoute from './ProtectedRoute';
import AuthPage from '@/features/auth/pages/AuthPage';
import AboutPage from '@/features/User/Shop/Page/About';
import DetailPage from '@/features/User/Shop/Page/Detail';
import UserProfileLayout from '@/layout/UserProfileLayout';
import ProfileUser from '@/features/User/UserProfile/pages/ProfileUser';
import UserOrderTracking from '@/features/User/UserProfile/pages/UserOrderTracking';
import PurchaseHistoryPage from '@/features/User/UserProfile/pages/PurchaseHistory';
import WorkshopPage from '@/features/User/UserProfile/pages/UserWorkshop';
import ChangePassword from '@/features/User/UserProfile/pages/UserSettingAccount';

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
            }
        ],
    },
    {
        element: <AdminLayout />,
        children: [
            {
                path: '/admin',
                children: [
                    {
                        path: 'Manager-Account',
                        element: <AdminManagerAccount />,
                    },
                    {
                        path: 'Manager-Order',
                        element: <AdminManagerOrder />,
                    },
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
                        ],
                    },
                    {
                        path: "/wishlist",
                        element: <WishlistPage />,
                    },
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
                    }
                ],
            }
        ]
    }
]);
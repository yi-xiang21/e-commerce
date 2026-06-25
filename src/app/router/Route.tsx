import { createBrowserRouter } from 'react-router-dom';
//import AdminLayout from '@/layout/AdminLayout';
import UserLayout from '@/layout/UserLayout';
import HomePage from '@/features/Home';
import AdminLayout from '@/layout/AdminLayout';
import AdminManagerAccount from '@/features/Admin/ManagerAccount/pages/AdminManagerAccount';
import ProtectedRoute from './ProtectedRoute';
import AuthPage from '@/features/Auth/pages/AuthPage';
import AboutPage from '@/features/About';
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
                        index: true,
                        path: 'Manager-Account',
                        element: <AdminManagerAccount />,
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
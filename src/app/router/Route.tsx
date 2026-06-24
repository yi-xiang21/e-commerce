import { createBrowserRouter } from 'react-router-dom';
//import AdminLayout from '@/layout/AdminLayout';
import UserLayout from '@/layout/UserLayout';
import HomePage from '@/features/Home';
import AdminLayout from '@/layout/AdminLayout';
import AdminManagerAccount from '@/features/Admin/ManagerAccount/pages/AdminManagerAccount';
import ProtectedRoute from './ProtectedRoute';
import AuthPage from '@/features/auth/pages/AuthPage';




export const routes = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
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
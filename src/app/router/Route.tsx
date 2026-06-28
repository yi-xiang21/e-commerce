import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '@/layout/AdminLayout';
import UserLayout from '@/layout/UserLayout';
import HomePage from '@/features/Home';
import CategoryManager from '@/features/admin/CategoryManager';
import ShopPage from '@/features/shop/ShopPage';

export const routes = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/shop',
                element: <ShopPage />,
            }
        ],
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: '',
                element: <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
                    <p className="text-gray-500">Chào mừng bạn đến với trang quản trị.</p>
                </div>,
            },
            {
                path: 'categories',
                element: <CategoryManager />,
            }
        ],
    },
])
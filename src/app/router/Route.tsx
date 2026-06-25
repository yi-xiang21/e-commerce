import { createBrowserRouter } from 'react-router-dom';
//import AdminLayout from '@/layout/AdminLayout';
import UserLayout from '@/layout/UserLayout';
import HomePage from '@/features/Home';
import AdminLayout from '@/layout/AdminLayout';
import AdminManagerAccount from '@/features/Admin/ManagerAccount/pages/AdminManagerAccount';
import WishlistPage from '@/features/User/Wishlist/pages/WishlistPage';




export const routes = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: "/wishlist",
                element: <WishlistPage />,
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
]);
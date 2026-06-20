import { createBrowserRouter } from 'react-router-dom';
//import AdminLayout from '@/layout/AdminLayout';
import UserLayout from '@/layout/UserLayout';
import HomePage from '@/features/Home';




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
])
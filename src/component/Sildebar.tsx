import { useNavigate, useLocation } from 'react-router-dom'

interface SidebarProps {
    isOpen?: boolean;
    toggleSidebar?: () => void;
}

const menuItems = [
    { name: 'Dashboard', link: '/admin' },
    { name: 'Quản lý người dùng', link:'/admin/Manager-Account' },
     { name: 'Quản lý đơn hàng', link: '/admin/Manager-Order' },
    { name: 'Quản lý sản phẩm', link: '/admin/Manager-Product' },
    { name: 'Quản lý Kho', link: '/admin/Manager-Stock' },
    { name: 'Quản lý danh mục', link: '/admin/Manager-Categories' },
    { name: 'Quản lý vouchers', link: '/admin/Manager-Voucher' },
    { name: 'Quản lý khuyến mãi', link: '/admin/Manager-Promotion' },
    { name: 'Quản lý workshop', link: '' },
    { name: 'Quay về trang chủ', link: '/' },
    { name: 'Cài đặt', link: '/admin/setting' }
]

const Sildebar = ({ isOpen = false, toggleSidebar }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (rawLink: string) => {
        const link = rawLink && rawLink.startsWith('/') ? rawLink : `/${rawLink}`;
        navigate(link);
        toggleSidebar?.();
    }

    return (
        <>
            <button
                className={`fixed top-4 left-4 z-60 md:hidden p-2 bg-white rounded-md shadow ${isOpen ? 'hidden' : 'block'}`}
                onClick={() => toggleSidebar?.()}
            >
                {isOpen ? '' : '☰'}
            </button>

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-300 p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto`}>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold text-[#1f1935]'>Admin Panel</h1>
                <button className='md:hidden p-2 bg-gray-200 rounded-md' onClick={() => toggleSidebar?.()}>
                    {isOpen ? 'X' : ''}
                </button>
            </div>
            <ul className='space-y-2'>
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.link;
                    return (
                        <li
                            key={index}
                            onClick={() => handleNavigate(item.link)}
                            className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-sky-100 text-sky-700 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                            {item.name}
                        </li>
                    )
                })}
            </ul>
            </aside>
        </>
    )
}

export default Sildebar

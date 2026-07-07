import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const ShipperLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Đơn hàng chờ lấy', link: '/shipper/available-orders' },
    { name: 'Đang giao', link: '/shipper/my-deliveries' },
    { name: 'Lịch sử giao hàng', link: '/shipper/delivery-history' },
    { name: 'Thông tin cá nhân', link: '/shipper/profile' },
    { name: 'Quay về trang chủ', link: '/' },
    { name: 'Đăng xuất', link: '/shipper/setting' },
  ];

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <button
        className={`fixed top-4 left-4 z-60 md:hidden p-2 bg-white rounded-md shadow ${isOpen ? 'hidden' : 'block'}`}
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-300 p-4 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:inset-auto shadow-lg`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1f1935]">Shipper Portal</h1>
          <button 
            className="md:hidden p-2 bg-gray-200 rounded-md" 
            onClick={() => setIsOpen(false)}
          >
            X
          </button>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.link;
            return (
              <li
                key={item.link}
                onClick={() => {
                  navigate(item.link);
                  setIsOpen(false);
                }}
                className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${
                  isActive 
                    ? 'bg-sky-100 text-sky-700 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="p-4 flex-1">
        <div className="bg-white p-6 rounded-lg shadow-sm min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ShipperLayout;
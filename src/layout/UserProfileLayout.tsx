import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/app/redux/hooks'
import { logoutThunk } from '@/features/Auth/store/auth-thunk'
import { logout } from '@/features/Auth/store/auth-slice'
import { Modal } from 'antd'

const menuItems = [
  { label: 'Thông tin người dùng', to: '', end: true },
  { label: 'Theo dõi đơn hàng', to: 'order-tracking' },
  { label: 'Lịch sử mua hàng', to: 'purchase-history' },
  { label: 'Voucher', to: 'vouchers' },
  { label: 'Workshop', to: 'workshop' },
  { label: 'Tài khoản', to: 'account' },
]

const UserProfileLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch(logout());
      navigate('/auth/login');
    }
  };

  const handleLogoutClick = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?',
      okText: 'Đăng xuất',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleLogout
    });
  };

  return (
    <section className=' px-4 py-6 text-left sm:px-6 lg:px-8 lg:py-10'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]'>
        <aside className='rounded-3xl border border-amber-100 bg-white/90 p-4 shadow-[0_18px_50px_rgba(38,24,92,0.08)] backdrop-blur sm:p-5 lg:sticky lg:top-6 lg:self-start'>

          <nav >
            <ul className='space-y-2'>
              {menuItems.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'border-[#ffb488] bg-[#fff0e4] text-[#9f4420] shadow-[0_10px_24px_rgba(255,132,69,0.12)]'
                          : 'border-transparent  text-[#4e4763] hover:border-[#ffe0c5] hover:bg-[#fff8f0] hover:text-[#2d2642]',
                      ].join(' ')
                    }
                  >
                    <span>{item.label}</span>
                    <span className='text-lg leading-none text-current/70'>›</span>
                  </NavLink>
                </li>
              ))}

              <li>
                <button
                  type='button'
                  onClick={handleLogoutClick}
                  className='flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100'
                >
                  <span>Đăng xuất</span>
                  <span className='text-lg leading-none text-current/70'>›</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className=' rounded-3xl border border-amber-100 bg-white p-5 shadow-[0_18px_50px_rgba(38,24,92,0.08)] sm:p-6 lg:p-8'>
          <Outlet />
        </main>
      </div>
    </section>
  )
}

export default UserProfileLayout

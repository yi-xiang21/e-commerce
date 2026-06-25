
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/redux/hooks';
import { authApi } from '@/features/Auth/api/auth-api';
import { logout } from '@/features/Auth/store/auth-slice';
const UserSettingAccount = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    finally {
      dispatch(logout());
    }
  };
  return (
    <section className='space-y-6'>

      <div className='grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]'>
        <div className='rounded-2xl border border-amber-100 bg-[#fffaf4] p-5'>
          <h3 className='text-lg font-semibold text-[#2d2642]'>Trạng thái tài khoản</h3>
          <p className='mt-2 text-sm leading-6 text-[#675f80]'>Tài khoản đã sẵn sàng để theo dõi đơn hàng, xem lịch sử mua hàng và tham gia workshop.</p>
        </div>

        <button
          onClick={() => handleLogout()}
          className='inline-flex items-center justify-center rounded-2xl bg-[#ff6b3d] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f95d2d]'
        >
          Logout
        </button>
        <button onClick={() => navigate('../change-password')} className='inline-flex items-center justify-center rounded-2xl bg-[#ff6b3d] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f95d2d]'>
            Đổi mật khẩu
        </button>

      </div>
      
    </section>
    
  )
}

export default UserSettingAccount

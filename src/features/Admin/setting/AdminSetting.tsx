import { logoutThunk } from '@/features/Auth/store/auth-thunk';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/app/redux/hooks';

const AdminSetting = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await dispatch(logoutThunk()).unwrap();

                navigate("/auth/login");
        } catch (error) {
            console.log(error);
        }
    }; 

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Đăng xuất
      </button>
    </div>
  )
}

export default AdminSetting
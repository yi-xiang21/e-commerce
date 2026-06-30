import { logoutThunk } from '@/features/Auth/store/auth-thunk';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/app/redux/hooks';
import { Modal } from 'antd';

const ShipperSetting = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        Modal.confirm({
            title: 'Xác nhận đăng xuất',
            content: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?',
            okText: 'Đăng xuất',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await dispatch(logoutThunk()).unwrap();
                    navigate("/auth/login");
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }; 

  return (
    <div className="p-6">
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
      >
        Đăng xuất
      </button>
    </div>
  )
}

export default ShipperSetting

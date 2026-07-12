import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAppDispatch } from '@/app/redux/hooks';
import { changePasswordThunk } from '@/features/Auth/store/auth-thunk';

export default function ChangePasswordForm() {
  const dispatch = useAppDispatch();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setMessage({ type: 'error', text: 'Thiếu thông tin đặt lại mật khẩu! ' });
    }
    if (newPassword.length < 8) {
      return setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!' });
    }
    if (newPassword === currentPassword) {
      return setMessage({ type: 'error', text: 'Mật khẩu mới không được trùng với mật khẩu cũ!' });
    }
    if (newPassword !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Mật khẩu nhập lại không khớp!' });
    }

    // 2. Gọi API
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await dispatch(changePasswordThunk({ 
        currentPassword: currentPassword, 
        newPassword: newPassword,
        confirmPassword: confirmPassword
      })).unwrap();

      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      
      // Xóa trắng form sau khi thành công
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-mb">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Đổi Mật Khẩu</h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 
                'bg-green-50 text-green-600 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            placeholder="Mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => { setCurrentPassword(e.target.value); setMessage({ type: '', text: '' }); }}
            className="bg-gray-50 text-gray-800 border border-gray-200 px-4 py-3 w-full rounded focus:outline-none focus:border-orange-400 pr-10"
          />
          <button type="button" onClick={() => setShowCurrent(!showCurrent)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
            {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setMessage({ type: '', text: '' }); }}
            className="bg-gray-50 text-gray-800 border border-gray-200 px-4 py-3 w-full rounded focus:outline-none focus:border-orange-400 pr-10"
          />
          <button type="button" onClick={() => setShowNew(!showNew)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
            {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setMessage({ type: '', text: '' }); }}
            className="bg-gray-50 text-gray-800 border border-gray-200 px-4 py-3 w-full rounded focus:outline-none focus:border-orange-400 pr-10"
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
            {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className='inline-flex items-center justify-center rounded-2xl bg-[#ff6b3d] px-5 py-3 text-sm font-semibold text-white 
            transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f95d2d]'
        >
          {isLoading ? 'Đang xử lý...' : 'Cập Nhật Mật Khẩu'}
        </button>
      </form>
    </div>
  );
}
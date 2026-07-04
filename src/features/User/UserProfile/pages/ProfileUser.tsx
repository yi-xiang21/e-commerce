import { useState, useEffect } from 'react';
import type { user } from '@/features/Auth/types/auth-type';
import { userApi } from '@/features/User/UserProfile/api/user-api';
import { useAppSelector } from '@/app/redux/hooks';

const ProfileUser = () => {
  const { error, loading, user } = useAppSelector((state) => state.auth);

  const [profileForm, setProfileForm] = useState<user>(user || {
    user_id: '',
    username: '',
    email: '',
    phone_number: '',
    role: '',
    first_name: '',
    last_name: '',
  });

  // Đồng bộ lại state form khi dữ liệu user từ redux thay đổi hoặc được nạp thành công
  useEffect(() => {
    if (user) {
      setProfileForm(user);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setProfileForm(response as unknown as user);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchProfile();
  }, [user?.user_id]);

  const handleUpdateProfile = async () => {
    console.log('Updating profile with data:', profileForm);
    try {
      const response = await userApi.updateProfile(profileForm);
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <section className='space-y-6 max-w-4xl mx-auto p-4 md:p-6'>
      {/* Tiêu đề trang */}
      <div>
        <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#b95b2d]'>Thông tin người dùng</p>
        <h2 className='mt-1 text-2xl md:text-3xl font-semibold text-[#1f1935]'>Hồ sơ cá nhân</h2>
      </div>

      {/* Khung nội dung */}
      <div className='rounded-2xl border border-amber-100 bg-[#8fbbbb1c] p-5 md:p-6 shadow-sm'>

        {/* Loading State */}
        {loading && (
          <div className='mb-4 flex items-center gap-2 text-sm text-[#675f80] animate-pulse'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-[#b95b2d] border-t-transparent'></div>
            Đang tải dữ liệu người dùng...
          </div>
        )}

        {/* Error State */}
        {error && (
          <p className='mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700'>
            {error}
          </p>
        )}

        {/* Form Inputs Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>

          {/* Tên người dùng */}
          <div className='flex flex-col space-y-1.5'>
            <label className='text-sm font-medium text-[#4b4464]'>Tên người dùng</label>
            <input
              type='text'
              value={profileForm.username || ''}
              onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              className='w-full rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#b95b2d] focus:ring-1 focus:ring-[#b95b2d]'
              placeholder='Nhập tên người dùng'
            />
          </div>

          {/* Email */}
          <div className='flex flex-col space-y-1.5'>
            <label className='text-sm font-medium text-[#4b4464]'>Email</label>
            <input
              type='email'
              value={profileForm.email || ''}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className='w-full rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#b95b2d] focus:ring-1 focus:ring-[#b95b2d]'
              placeholder='example@domain.com'
            />
          </div>

          {/* Số điện thoại */}
          <div className='flex flex-col space-y-1.5'>
            <label className='text-sm font-medium text-[#4b4464]'>Số điện thoại</label>
            <input
              type='text'
              value={profileForm.phone_number || ''}
              onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
              className='w-full rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#b95b2d] focus:ring-1 focus:ring-[#b95b2d]'
              placeholder='Nhập số điện thoại'
            />
          </div>

          {/* Khoảng trống để căn chỉnh dòng tiếp theo tốt hơn (Họ và Tên) */}
          <div className='hidden md:block' />

          {/* Họ và tên đệm */}
          <div className='flex flex-col space-y-1.5'>
            <label className='text-sm font-medium text-[#4b4464]'>Họ và tên đệm</label>
            <input
              type='text'
              value={profileForm.first_name || ''}
              onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
              className='w-full rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#b95b2d] focus:ring-1 focus:ring-[#b95b2d]'
            />
          </div>

          {/* Tên */}
          <div className='flex flex-col space-y-1.5'>
            <label className='text-sm font-medium text-[#4b4464]'>Tên</label>
            <input
              type='text'
              value={profileForm.last_name || ''}
              onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
              className='w-full rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#b95b2d] focus:ring-1 focus:ring-[#b95b2d]'
            />
          </div>

        </div>

        {/* Nút hành động */}
        <div className='flex justify-end mt-6 border-t border-amber-100/40 pt-4'>
          <button
            onClick={handleUpdateProfile}
            className='rounded-xl bg-[#ffc490] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#eb8f39] hover:shadow-md active:scale-[0.98]'
          >
            Cập nhật thông tin
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProfileUser;
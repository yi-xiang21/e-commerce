

import {  useState,useEffect } from 'react';

import type { user } from '@/features/Auth/types/auth-type';
import { userApi } from '@/features/User/UserProfile/api/user-api';
import { useAppSelector } from '@/app/redux/hooks';

const ProfileUser = () => {

  const { error, loading,user } = useAppSelector((state) => state.auth);

  const [profileForm, setProfileForm] = useState<user>( user || {
  user_id: '',
  username: '',
  email: '',
  phone_number: '',
  role: '',
  first_name: '',
  last_name: '',
});
  useEffect(() => {
    if (!user?.user_id) {
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setProfileForm(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchProfile();
  }, [user?.user_id, user]);

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('username', profileForm.username || '');
      formData.append('email', profileForm.email || '');
      formData.append('phone_number', profileForm.phone_number || '');
      formData.append('first_name', profileForm.first_name || '');
      formData.append('last_name', profileForm.last_name || '');
      await userApi.updateProfile(formData);
      alert('Cập nhật thông tin thành công!');
    }
    catch (error) {
      console.error('Failed to update profile:', error);
      alert('Cập nhật thông tin thất bại. Vui lòng thử lại.');
    }
  }

  return (
    <section className='space-y-6'>
      <div>
        <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#b95b2d]'>Thông tin người dùng</p>
        <h2 className='mt-2 text-3xl font-semibold text-[#1f1935]'>Hồ sơ cá nhân</h2>
      </div>

      <div className=' p-5'>
        <div className='rounded-2xl border border-amber-100 bg-[#8fbbbb55] p-5'>

          {loading ? (
            <p className='mt-3 text-sm text-[#675f80]'>Đang tải dữ liệu người dùng...</p>
          ) : null}

          {error ? (
            <p className='mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              {error}
            </p>
          ) : null}

          <div className='mt-4 grid gap-3'>
              <div className='space-y-3'>
                <label className='text-sm text-[#4b4464]'>
                  Tên người dùng
                  <input
                    type='text'
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                    className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                  />
                </label>

                <label className='text-sm text-[#4b4464]'>
                  Email
                  <input
                    type='email'
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                  />
                </label>

                <label className='text-sm text-[#4b4464]'>
                  Số điện thoại
                  <input
                    type='text'
                    value={profileForm.phone_number}
                    onChange={(e) => setProfileForm({...profileForm, phone_number: e.target.value})}
                    className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                  />
                </label>

                <label className='text-sm text-[#4b4464]'>
                  Họ và tên đệm
                  <input
                    type='text'
                    value={profileForm.first_name}
                    onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                    className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                  />
                </label>
                <label className='text-sm text-[#4b4464]'>
                  Tên
                  <input
                    type='text'
                    value={profileForm.last_name}
                    onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                    className='mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none'
                  />
                </label>    
              </div>
            
          </div>
          <div className='flex justify-end mt-5'  >
            <button onClick={handleUpdateProfile} className='mt-5 rounded-xl bg-[#ffb488] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9a5c]' >
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileUser

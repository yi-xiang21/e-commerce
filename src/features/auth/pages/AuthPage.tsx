import { useAppDispatch } from "@/app/redux/hooks";
import LoginPage from "@/component/LoginPage";
import OverlayPanel from "@/component/OverlayPanel";
import RegisterPage from "@/component/RegisterPage";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMeThunk, loginThunk, registerThunk } from "@/features/Auth/store/auth-thunk";
import { clearError } from "@/features/Auth/store/auth-slice";
import type { LoginPayload, RegisterPayload } from "@/features/Auth/types/auth-type";



export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();


  const [isSignUp, setIsSignUp] = useState(
    location.pathname === '/auth/register'
  );
  // Tách riêng message cho Login và Register để không ảnh hưởng lẫn nhau
  const [loginMessage, setLoginMessage] = useState<string>('');
  const [registerMessage, setRegisterMessage] = useState<string>('');


  useEffect(() => {
    setIsSignUp(location.pathname === '/auth/register');
  }, [location.pathname]);

  // Tự động ẩn message login sau 3 giây
  useEffect(() => {
    if (!loginMessage) return;

    const timer = window.setTimeout(() => {
      setLoginMessage('');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [loginMessage]);

  // Tự động ẩn message register sau 3 giây
  useEffect(() => {
    if (!registerMessage) return;

    const timer = window.setTimeout(() => {
      setRegisterMessage('');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [registerMessage]);

  const handlePanelSwitch = (mode: 'login' | 'register') => {
    dispatch(clearError());
    setLoginMessage('');
    setRegisterMessage('');
    setIsSignUp(mode === 'register');
    navigate(`/auth/${mode}`, { replace: true });
  };

  const handleLogin = async (formData: LoginPayload): Promise<boolean> => {
    try {
      const result = await dispatch(loginThunk(formData)).unwrap();
      setLoginMessage('');

      if (result?.access_token) {
        await dispatch(getMeThunk()).unwrap();
      }

      navigate("/");
      return true;
    } catch (err) {
      // .unwrap() khi rejectWithValue trả về string → dùng trực tiếp
      const errorMessage = typeof err === 'string' ? err : 'Đăng nhập thất bại';
      setLoginMessage(errorMessage);
      console.error("Login failed:", err);
      return false;
    }
  };

  const handleRegister = async (formData: RegisterPayload): Promise<boolean> => {
    try {
      console.log('Register form data:', formData);
      await dispatch(registerThunk(formData)).unwrap();
      setRegisterMessage('');
      handlePanelSwitch("login");
      return true;
    } catch (err) {
      // .unwrap() khi rejectWithValue trả về string → dùng trực tiếp
      const errorMessage = typeof err === 'string' ? err : 'Đăng ký thất bại';
      setRegisterMessage(errorMessage);
      console.error("Register failed:", err);
      return false;
    }
  };

  return (
    <div className="flex justify-center items-center h-full bg-[#f6f5f7] font-sans pt-16 pb-16">


      <div
        className={` bg-white rounded-[10px] relative overflow-hidden w-4/5 max-w-full min-h-[620px]
        shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)] `}
      >
        {/* LOGIN FORM */}
        <div
          className={` absolute top-0 left-0 h-full w-1/2 transition-all duration-600 ease-in-out
          ${
            isSignUp
              ? 'translate-x-full opacity-0 z-10' // Khi đăng ký: Trượt sang phải, ẩn đi
              : 'translate-x-0 opacity-100 z-20'  // Mặc định: Nằm bên trái, hiển thị
            } `}
        >
          <LoginPage onLogin={handleLogin} errorMessage={loginMessage} />
        </div>

        {/* REGISTER FORM */}
        <div
          className={` absolute top-0 left-0 h-full w-1/2 transition-all duration-600 ease-in-out
          ${
            isSignUp
              ? 'translate-x-full opacity-100 z-20' // Khi đăng ký: Trượt sang phải, hiện lên
              : 'translate-x-0 opacity-0 z-10'      // Mặc định: Nằm bên trái, ẩn đi
            }
        `}
        >
          <RegisterPage onRegister={handleRegister} errorMessage={registerMessage} />
        </div>

        {/* MẢNG XANH TRƯỢT OVERLAY */}
        <OverlayPanel
          isSignUp={isSignUp}
          onSwitch={handlePanelSwitch}
        />
      </div>
    </div>
  );
}

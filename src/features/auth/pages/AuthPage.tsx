import { useAppDispatch } from "@/app/redux/hooks";
import LoginPage from "@/features/components/auth/LoginPage";
import OverlayPanel from "@/features/components/auth/OverlayPanel";
import RegisterPage from "@/features/components/auth/RegisterPage";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMeThunk, loginThunk, registerThunk } from "@/features/auth/store/auth-thunk";
import { clearError } from "@/features/auth/store/auth-slice";
import type { LoginPayload, RegisterPayload } from "@/features/auth/types/auth-type";


export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();


  const [isSignUp, setIsSignUp] = useState(
    location.pathname === '/auth/register'
  );
  const [message, setMessage] = useState<string>('');


  useEffect(() => {
    setIsSignUp(location.pathname === '/auth/register');
  }, [location.pathname]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      setMessage('');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [message]);

  const handlePanelSwitch = (mode: 'login' | 'register') => {
    dispatch(clearError());
    setMessage('');
    setIsSignUp(mode === 'register');
    navigate(`/auth/${mode}`, { replace: true });
  };

  const handleLogin = async (formData: LoginPayload): Promise<boolean> => {
    try {
      const result = await dispatch(loginThunk(formData)).unwrap();
      setMessage('');

      if (result?.access_token) {
        await dispatch(getMeThunk()).unwrap();
      }

      navigate("/");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bạn chưa có tài khoản';
      setMessage(errorMessage);
      console.error("Login failed:", err);
      return false;
    }
  };

  const handleRegister = async (formData: RegisterPayload): Promise<boolean> => {
    try {
      await dispatch(registerThunk(formData)).unwrap();
      setMessage('');
      handlePanelSwitch("login");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đăng ký thất bại! Email đã tồn tại';
      setMessage(errorMessage);
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
          <LoginPage onLogin={handleLogin} errorMessage={message} />
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
          <RegisterPage onRegister={handleRegister} errorMessage={message} />
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
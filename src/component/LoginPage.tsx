import type { LoginPayload } from "@/features/Auth/types/auth-type";
import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router";


type Props = {
  onLogin: (data: LoginPayload) => Promise<boolean>;
  errorMessage?: string;
};

export default function LoginPage({ onLogin, errorMessage }: Props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

    const validateLogin = () => {
      if (!email.trim()) {
        return "Vui lòng nhập email hoặc tên đăng nhập";
      }
  
      if (!password.trim()) {
        return "Vui lòng nhập mật khẩu";
      }
  
      return "";
    };

    useEffect(() => {
      if (!validationError) return;
  
      const timer = window.setTimeout(() => {
        setValidationError('');
      }, 3000);
  
      return () => window.clearTimeout(timer);
    }, [validationError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateLogin();

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError("");

    const success = await onLogin({
      email: email,
      password,
    });

    if (success) {
      setEmail("");
      setPassword("");
    }
    // await onLogin({ email, password});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white flex flex-col items-center justify-center px-13 h-full text-center"
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Đăng Nhập
      </h1>

      {(validationError || errorMessage) && (
        <div role="alert" className="w-full mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {validationError || errorMessage}
        </div>
      )}

      <div className="w-full flex flex-col gap-3 mb-8">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          className="bg-[#eee] text-gray-800 border-none h-14 px-5 w-full rounded focus:outline-none"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mật khẩu"
            value={password}
            autoComplete="new-password"
            onChange={(e) => {
              setPassword(e.target.value)
              if (validationError) setValidationError('')
            }}
            className="bg-[#eee] text-gray-800 border-none h-14 px-5 w-full rounded focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="rounded-full bg-orange-400 border border-orange-500 text-white text-xs font-bold px-11 py-3 
          tracking-[1px] focus:outline-none hover:bg-orange-300"
      >
        ĐĂNG NHẬP
      </button>

      <Link
        to="/auth/forgot-password"
        className="text-[18px] text-[#f31b1b] no-underline hover:underline mt-8"
      >
        Quên mật khẩu?
      </Link>
    </form>
  );
}
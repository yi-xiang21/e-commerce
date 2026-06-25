import type { LoginPayload } from "@/features/Auth/types/auth-type";
import React, { useEffect, useState } from "react";


type Props = {
  onLogin: (data: LoginPayload) => Promise<boolean>;
  errorMessage?: string;
};

export default function LoginPage({ onLogin, errorMessage }: Props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          className="bg-[#eee] text-gray-800 border-none px-5 py-4 w-full rounded focus:outline-none"
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
          className="bg-[#eee] text-gray-800 border-none px-5 py-4 w-full rounded focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-orange-400 border border-orange-500 text-white text-xs font-bold px-11 py-3 
          tracking-[1px] focus:outline-none hover:bg-orange-300"
      >
        ĐĂNG NHẬP
      </button>

      <a
        href="#"
        /* Đã xóa bỏ my-5, chỉ giữ lại mt-10 (hoặc mt-20 tùy bạn) để đẩy chữ cách xa nút Đăng nhập */
        className="text-[18px] text-[#f31b1b] no-underline hover:underline mt-8"
      >
        Quên mật khẩu?
      </a>
    </form>
  );
}
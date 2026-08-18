import type { RegisterPayload } from "@/features/Auth/types/auth-type";
import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";


type Props = {
  onRegister: (data: RegisterPayload) => Promise<boolean>;
  errorMessage?: string;
};

export default function RegisterPage({ onRegister, errorMessage }: Props) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [role] = useState('customer');
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(value)) {
      return "Email không hợp lệ";
    }
    return "";
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(value)) {
      return "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có đúng 10 số)";
    }
    return "";
  };

  const validateUsername = (value: string) => {
    if (value.trim().length < 3 || value.trim().length > 20) {
      return "Username phải có độ dài từ 3 đến 20 ký tự";
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(value)) {
      return "Username chỉ được chứa các ký tự chữ cái không dấu (a-z, A-Z), chữ số (0-9) và dấu gạch dưới (_), không chứa dấu cách hoặc ký tự đặc biệt khác";
    }
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) {
      return "Vui lòng nhập mật khẩu";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      return "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (ví dụ: @, $, !, %, *, ?, &)";
    }
    return "";
  };

  useEffect(() => {
    if (!validationError) return;

    const timer = window.setTimeout(() => {
      setValidationError('');
    }, 5000); // Tăng thời gian hiển thị thông báo lỗi chi tiết lên 5s để dễ đọc hơn

    return () => window.clearTimeout(timer);
  }, [validationError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Username
    if (!username.trim()) {
      setValidationError("Vui lòng nhập tên đăng nhập");
      return;
    }

    const usernameError = validateUsername(username);
    if (usernameError) {
      setValidationError(usernameError);
      return;
    }

    // Email
    if (!email.trim()) {
      setValidationError("Vui lòng nhập email");
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setValidationError(emailError);
      return;
    }

    // Phone
    if (!phone_number.trim()) {
      setValidationError("Vui lòng nhập số điện thoại");
      return;
    }

    const phoneError = validatePhone(phone_number);
    if (phoneError) {
      setValidationError(phoneError);
      return;
    }

    // Password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    // Confirm Password
    if (!confirmPassword.trim()) {
      setValidationError("Vui lòng nhập lại mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Mật khẩu nhập lại không khớp");
      return;
    }

    setValidationError("");

    const payload: RegisterPayload = {
      username,
      email,
      password,
      phone_number,
      role,
    };

    const resetForm = () => {
      setUsername("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
    };

    const success = await onRegister(payload);

    if (success) {
      resetForm();
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white flex flex-col items-center justify-center px-12 h-full text-center"
    >
      <h1 className="text-4xl font-bold text-gray-800">
        Đăng Ký
      </h1>

      {(validationError || errorMessage) && (
        <div role="alert" className="w-full mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {validationError || errorMessage}
        </div>
      )}

      <div className="w-full flex flex-col gap-3 mt-6 mb-10">
        <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (validationError) setValidationError("");
            }}
            className="bg-[#eee] text-gray-800 border-none h-14 px-5 w-full rounded focus:outline-none"
        />

        <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="off"
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationError) setValidationError("");
            }}
            className="bg-[#eee] text-gray-800 border-none h-14 px-5 w-full rounded focus:outline-none"
        />

        <input
          type="tel"
          placeholder="Số điện thoại"
          value={phone_number}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            if (validationError) setValidationError("");
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
            className="bg-[#eee] text-gray-800 border-none px-5 py-4 w-full rounded focus:outline-none pr-12"
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

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (validationError) setValidationError('')
            }}
            className="bg-[#eee] text-gray-800 border-none h-14 px-5 w-full rounded focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        
      </div>


      <button
        type="submit"
        className="rounded-full bg-orange-400 border border-orange-500 text-white text-xs font-bold px-11 
            py-3 tracking-[1px] focus:outline-none hover:bg-orange-300"
      >
        ĐĂNG KÝ
      </button>
    </form>
  );
}
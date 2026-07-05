import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/app/redux/hooks";
import { forgotPasswordThunk } from "@/features/Auth/store/auth-thunk";
import { clearError } from "@/features/Auth/store/auth-slice";

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) return "Vui lòng nhập email của bạn";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Địa chỉ email không đúng định dạng";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    try {
      setLoading(true);
      setError("");
      dispatch(clearError());
      
      await dispatch(forgotPasswordThunk({ email })).unwrap();
      
      sessionStorage.setItem("reset_email", email);
      navigate("/auth/verify-otp");
    } catch (err: any) {
      setError(err || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gradient-to-tr from-[#fffbf9] to-[#fff0e8] py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(255,130,60,0.08)] border border-orange-100/50 w-full max-w-[450px] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(255,130,60,0.12)]"
      >
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Quên mật khẩu
        </h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          Nhập email của bạn và chúng tôi sẽ gửi mã OTP để xác nhận đặt lại mật khẩu.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Địa chỉ Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full bg-gray-50 border border-gray-200 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-xl py-3.5 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang gửi...
            </span>
          ) : (
            "Gửi mã OTP"
          )}
        </button>

        <div className="mt-8 text-center">
          <Link
            to="/auth/login"
            className="inline-flex items-center text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors duration-200 gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/app/redux/hooks";
import { verifyOtpThunk, forgotPasswordThunk } from "@/features/Auth/store/auth-thunk";
import { clearError } from "@/features/Auth/store/auth-slice";

export default function VerifyOtpPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = sessionStorage.getItem("reset_email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const validate = () => {
    if (!otp.trim()) return "Vui lòng nhập mã OTP";
    if (otp.length !== 6 || isNaN(Number(otp))) return "Mã OTP phải bao gồm 6 chữ số";
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
      setResendMessage("");
      dispatch(clearError());

      const result = await dispatch(
        verifyOtpThunk({
          email,
          otp,
        })
      ).unwrap();

      sessionStorage.setItem("reset_token", result.reset_session_token);
      navigate("/auth/reset-password");
    } catch (err: any) {
      setError(err || "Xác thực OTP thất bại. Vui lòng kiểm tra lại mã!");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Không tìm thấy email. Vui lòng thực hiện lại từ bước quên mật khẩu.");
      return;
    }

    try {
      setResending(true);
      setError("");
      setResendMessage("");
      dispatch(clearError());

      await dispatch(forgotPasswordThunk({ email })).unwrap();
      setResendMessage("Mã OTP mới đã được gửi đến email của bạn.");
    } catch (err: any) {
      setError(err || "Gửi lại OTP thất bại. Vui lòng thử lại sau.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gradient-to-tr from-[#fffbf9] to-[#fff0e8] py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(255,130,60,0.08)] border border-orange-100/50 w-full max-w-[450px] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(255,130,60,0.12)]"
      >
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Xác thực OTP
        </h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi tới email: <br />
          <strong className="text-gray-700">{email || "email của bạn"}</strong>
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {resendMessage && (
          <div className="bg-green-50 text-green-600 border border-green-100 rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{resendMessage}</span>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
            Mã OTP
          </label>
          <input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="xxxxxx"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setOtp(value);
              setError("");
            }}
            className="w-full bg-gray-50 border border-gray-200 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-4 py-3 text-center text-xl font-bold tracking-widest text-gray-800 transition-all duration-200 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-xl py-3.5 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed transform active:scale-[0.98] mb-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang xác thực...
            </span>
          ) : (
            "Xác nhận"
          )}
        </button>

        <div className="flex justify-between items-center mt-6 text-sm">
          <Link
            to="/auth/forgot-password"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Quay lại
          </Link>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="text-orange-500 hover:text-orange-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? "Đang gửi lại..." : "Gửi lại OTP"}
          </button>
        </div>
      </form>
    </div>
  );
}
type Props = {
  isSignUp: boolean;
  onSwitch: (mode: 'login' | 'register') => void;
};

export default function OverlayPanel({ isSignUp, onSwitch }: Props) {
  return (
    <div
      className={` absolute top-0 left-1/2 w-1/2 h-full overflow-hidden
        transition-transform duration-600 ease-in-out z-[100]
        ${isSignUp ? '-translate-x-full' : 'translate-x-0'}
      `}
    >
      <div
        className={` bg-orange-300 text-white relative h-full w-[200%] -left-full
          transition-transform duration-600 ease-in-out
          ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}
        `}
      >
        {/* BÊN TRÁI (HIỆN KHI ĐANG Ở TRANG ĐĂNG KÝ) */}
        <div
          className={` absolute top-0 left-0 flex flex-col items-center justify-center
            text-center px-10 h-full w-1/2 transition-transform duration-600 ease-in-out
            ${isSignUp ? 'translate-x-0' : '-translate-x-[20%]'}
          `}
        >
          <h1 className="text-4xl text-red-500 font-bold m-0">
            Chào mừng bạn đến với Shoplen
          </h1>

          <p className="text-[18px] text-yellow-900 font-light leading-5 tracking-wide my-6 whitespace-pre-line">
            {"Bạn đã có tài khoản? \n Hãy hoàn tác đăng nhập đăng nhập!"}
          </p>

          <button
            onClick={() => onSwitch('login')}
            className="bg-transparent border border-white text-blue-500 text-xs font-bold px-11 py-3 hover:bg-orange-500
              uppercase tracking-[1px] rounded-full transition-transform active:scale-95 focus:outline-none"
          >
            ĐĂNG NHẬP
          </button>

        </div>

        {/* BÊN PHẢI (HIỆN KHI ĐANG Ở TRANG ĐĂNG NHẬP) */}
        <div
          className={`
          absolute top-0 right-0 flex flex-col items-center justify-center
          text-center px-10 h-full w-1/2 transition-transform duration-600 ease-in-out
          ${isSignUp ? 'translate-x-[20%]' : 'translate-x-0'}
        `}
        >
          <h1 className="text-4xl text-red-500 font-bold m-0">
            Xin chào bạn!
          </h1>

          <p className="text-[20px] text-yellow-900 font-light leading-5 tracking-wide my-6 whitespace-pre-line">
            {"Nếu bạn chưa có tài khoản! \n Hãy nhấn đăng ký để tạo tài khoản!"}
          </p>

          <button
            onClick={() => onSwitch('register')}
            className="bg-transparent border border-white text-white text-xs font-bold px-11 py-3 hover:bg-orange-500
              uppercase tracking-[1px] rounded-full transition-transform active:scale-95 focus:outline-none"
          >
            ĐĂNG KÝ
          </button>
        </div>
      </div>
    </div>
  );
}
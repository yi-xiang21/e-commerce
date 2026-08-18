import React from 'react';
import { Ticket, CalendarClock, MoveRight } from 'lucide-react';
import type { voucher } from '@/features/Admin/ManagerVoucher/type/Voucher';
import { parseToDayjs } from "@/share/ComponentCustom/FormatTime";
import { useNavigate } from 'react-router-dom';

interface VoucherCardProps {
  voucher: voucher;
}

const VoucherCard: React.FC<VoucherCardProps> = ({ voucher: v }) => {
  const navigate = useNavigate();

  const getDiscountText = (item: voucher) => {
    if (item.discount_type === 'percent') {
      return `Giảm ${Number(item.value)}%`;
    } else if (item.discount_type === 'free_ship') {
      return `Miễn phí vận chuyển`;
    } else {
      return `Giảm ${Number(item.value).toLocaleString('vi-VN')}đ`;
    }
  };

  const isFreeShip = v.discount_type === 'free_ship';

  return (
    <div className="group relative flex bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 ease-out hover:-translate-y-1 h-36">
      
      {/* Decorative background glow on hover */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Left part (Ticket shape) */}
      <div
        className={`w-32 flex flex-col items-center justify-center p-3 text-white relative shrink-0 z-10 transition-colors duration-500 ${
          isFreeShip
            ? 'bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-600'
            : 'bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600'
        }`}
      >
        {/* Ticket cutouts */}
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#f8fafc] shadow-inner"></div>
        <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[#f8fafc] shadow-inner"></div>
        
        {/* Perforated line */}
        <div className="absolute right-0 top-4 bottom-4 w-[2px] bg-white/30 border-r-2 border-dashed border-transparent mix-blend-overlay"></div>

        <Ticket size={36} className="mb-2 opacity-90 drop-shadow-md group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
        <span className="text-xs font-black uppercase tracking-widest text-center drop-shadow-sm">
          {isFreeShip ? 'Free Ship' : 'Voucher'}
        </span>
      </div>

      {/* Right part (Content) */}
      <div className="flex-1 p-4 flex flex-col min-w-0 bg-white relative z-10">
        <div className="h-21">
          <div className="flex justify-between items-start gap-3">
            <h3 className="font-bold text-slate-800 text-base leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
              {v.voucher_name}
            </h3>
            <span
              className={`shrink-0 px-2.5 py-1 font-bold text-[11px] uppercase tracking-wider rounded-full border shadow-sm ${
                isFreeShip
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                  : 'bg-blue-50 text-blue-600 border-blue-200/50'
              }`}
            >
              {getDiscountText(v)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[13px] text-slate-500">Mã:</span>
            <span className="font-bold text-sm tracking-wide text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{v.code}</span>
          </div>
          
          {v.minimum_value && Number(v.minimum_value) > 0 && (
            <p className="text-xs text-slate-500 font-medium mt-1">
              Đơn tối thiểu <span className="text-slate-700 font-semibold">{Number(v.minimum_value).toLocaleString('vi-VN')}đ</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-medium bg-orange-50 px-2 py-1 rounded-md text-orange-600 border border-orange-100/50">
            <CalendarClock size={14} />
            <span>
              HSD: {v.end_date ? parseToDayjs(v.end_date)?.format("DD/MM/YYYY") : "Không giới hạn"}
            </span>
          </div>
          <button
            onClick={() => navigate('/shop')} 
            className={`text-sm font-bold flex items-center gap-1.5 group/btn cursor-pointer px-4 py-1.5 rounded-lg transition-all shadow-sm ${
              isFreeShip 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-emerald-200 hover:shadow-md' 
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-blue-200 hover:shadow-md'
            }`}
          >
            Dùng ngay
            <MoveRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;
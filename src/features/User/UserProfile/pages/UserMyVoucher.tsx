import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rewardUserApi } from '@/features/User/UserProfile/api/rewardUser_api';
import type { voucher } from '@/features/Admin/ManagerVoucher/type/Voucher';
import { Spin } from 'antd';
import { Ticket, ArrowLeft, ReceiptText } from 'lucide-react';
import Notification from '@/share/ComponentCustom/Notification/Notification';
import VoucherCard from '@/component/VoucherCard';

const UserMyVoucher = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifyData, setNotifyData] = useState<{
    key: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchMyVouchers = async () => {
      try {
        setLoading(true);
        // Gọi hàm từ API của User Client
        const response = await rewardUserApi.getMyVouchers();
        console.log("=== API Response Full ===", response);

        const apiVouchers = response?.data?.vouchers || response?.data?.data?.vouchers || [];
        
        const formattedVouchers = apiVouchers.map((v: any, index: number) => ({
          voucher_id: v.voucher_id || v.reward_id || index,
          code: v.code || v.voucher_code || 'N/A',
          voucher_name: v.voucher_name || 'Voucher không tên',
          discount_type: v.discount_type || 'cash',
          value: v.value !== undefined ? Number(v.value) : Number(v.discount_value || 0),
          minimum_value: Number(v.minimum_value || 0),
          quantity: v.quantity || 1,
          start_date: v.start_date || new Date().toISOString(),
          end_date: v.end_date || new Date().toISOString(),
        }));

        setVouchers(formattedVouchers);
      } catch (error: any) {
        setNotifyData({
          key: Date.now().toString(),
          type: 'error',
          title: 'Lỗi',
          message: error.response?.data?.message || 'Không thể tải danh sách voucher.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMyVouchers();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 relative">
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type as any}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}

      <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ReceiptText className="text-blue-500" size={24} />
            Kho Voucher Của Tôi
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Quản lý các mã giảm giá bạn đã thu thập</p>
        </div>
      </div>

      {/* Voucher List */}
      <Spin spinning={loading}>
        {vouchers.length > 0 ? (
          <div className="flex flex-col gap-5">
            {vouchers.map((v) => (
              <VoucherCard key={v.voucher_id} voucher={v} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="py-16 bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
              <div className="p-5 bg-slate-50 rounded-full mb-4">
                <Ticket size={48} className="text-slate-300" />
              </div>
              <p className="text-slate-700 text-lg font-bold mb-1">Kho voucher trống</p>
              <p className="text-slate-500 text-sm text-center max-w-sm mb-6">
                Bạn chưa có voucher nào trong kho. Hãy quay lại cửa hàng để đổi thêm voucher nhé!
              </p>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-sm hover:shadow-blue-200 hover:shadow-md cursor-pointer"
              >
                Khám phá ngay
              </button>
            </div>
          )
        )}
      </Spin>
    </div>
  );
};

export default UserMyVoucher;
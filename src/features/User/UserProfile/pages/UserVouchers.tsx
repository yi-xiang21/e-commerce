import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { rewardUserApi } from "../api/rewardUser_api"; 
import { useEffect, useState } from 'react';
import type { rewardsUser } from '@/features/User/UserProfile/types/rewardUser';
import Notification from '@/share/ComponentCustom/Notification/Notification';
import { Link } from 'react-router-dom';
import { Coins, Ticket, History, TicketPercent } from 'lucide-react';
import { useFormModal } from '@/share/hook/useFormModal';
import { Pagination, Spin } from 'antd';
import { getMeThunk } from '@/features/Auth/store/auth-thunk';


const UserVouchers = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [rewards, setRewards] = useState<rewardsUser[]>([]);
  const [isExchanging, setIsExchanging] = useState(false);
  const [notifyData, setNotifyData] = useState<{
    key: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  } | null>(null);

  const {
    currentPage,
    pageSize,
    total,
    loading,
    setCurrentPage,
    setTotal,
    setLoading
  } = useFormModal<rewardsUser>();

  const fetchRewards = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const response = await rewardUserApi.getCanRedeemRewards(page, limit);
      setRewards(response.data?.data?.rewards || []);
      setTotal(response.data?.data?.pagination?.total_items);
    } catch (error: any) {
      const errorTimestamp = String(new Date().getTime());

      setNotifyData({
        key: `err-${errorTimestamp}`,
        type: 'error',
        title: 'Lỗi',
        message: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleExchange = async (rewardId: number) => {
    try {
      setIsExchanging(true);
      await rewardUserApi.redeemReward(rewardId);
      dispatch(getMeThunk());

      const successTimestamp = String(new Date().getTime());
      setNotifyData({
        key: `success-${successTimestamp}-${rewardId}`,
        type: 'success',
        title: 'Thành công',
        message: 'Đổi voucher thành công!'
      });
      fetchRewards(currentPage, pageSize);
    } catch (error: any) {
      const errorTimestamp = String(new Date().getTime());
      setNotifyData({
        key: `err-exchange-${errorTimestamp}`,
        type: 'error',
        title: 'Lỗi',
        message: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.'
      });
    } finally {
      setIsExchanging(false);
    }
  };

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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-full">
            <Coins size={28} />
          </div>

          <div>
            <p className="text-sm text-slate-500 font-medium">Điểm tích lũy hiện tại</p>
            <p className="text-2xl font-bold text-amber-500">
              {user?.loyalty_points} <span className="text-sm text-slate-400 font-normal">điểm</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/profile/my-vouchers" className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Ticket size={20} />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-600 transition-colors uppercase tracking-wider">Voucher của tôi</span>
          </Link>
          <div className="w-px h-10 bg-slate-100"></div>
          <Link to="/profile/vouchers/history-redeem" className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <History size={20} />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">Lịch sử đổi</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-slate-800">Cửa hàng Voucher</h2>
      </div>


      <Spin spinning={loading}>
        {rewards.length > 0 ? (
          <div className="flex flex-col gap-4">
            {rewards.map((v) => (
              <div key={v.reward_id} className="flex bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-1 h-36">

                <div className="w-28 bg-linear-to-br from-rose-400 to-rose-600 flex flex-col items-center justify-center p-3 text-white border-r-2 border-dashed border-white relative shrink-0">
                  <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-slate-50"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-slate-50"></div>
                  <TicketPercent size={32} className="mb-2 opacity-90" />
                  <span className="text-xs font-bold uppercase tracking-wider text-center">Mã giảm</span>
                </div>


                <div className="flex-1 p-4 flex  justify-between min-w-0">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base line-clamp-1">{v.voucher_name}</h3>
                    <p className="text-[13px] text-slate-500 mt-0.5 line-clamp-1">
                      Mã: {v.voucher_code}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold text-xs rounded border border-rose-100">
                        {v.discount_type === 'percent' ? `Giảm ${Number(v.discount_value)}%` : `Giảm ${Number(v.discount_value).toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                      <Coins size={16} />
                      <span>
                        {v.required_points} điểm
                      </span>
                    </div>
                    <button
                      onClick={() => handleExchange(v.reward_id!)}
                      disabled={isExchanging || (user?.loyalty_points || 0) < (v.required_points || 0)}
                      className={`px-4 py-1.5 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm ${isExchanging || (user?.loyalty_points || 0) < (v.required_points || 0)
                        ? 'bg-slate-300 cursor-not-allowed opacity-60'
                        : 'bg-rose-500 hover:bg-rose-600 hover:shadow-rose-200 hover:shadow-md'
                        }`}
                    >
                      {(user?.loyalty_points || 0) < (v.required_points || 0) ? 'Không đủ điểm' : 'Đổi điểm'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
            <TicketPercent size={48} className="text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Hiện tại không có voucher nào để đổi.</p>
          </div>
        )}
      </Spin>

      {total > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );

};

export default UserVouchers;

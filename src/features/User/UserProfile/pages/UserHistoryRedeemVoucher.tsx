import { useEffect, useState } from 'react';
import { rewardUserApi } from '@/features/User/UserProfile/api/rewardUser_api'; 
import type { redeemHistory } from '@/features/User/UserProfile/types/rewardUser'; 
import { Coins, ArrowDownRight, ArrowUpRight, History, ArrowLeft } from 'lucide-react';
import { parseToDayjs } from "@/share/ComponentCustom/FormatTime";
import { useNavigate } from 'react-router-dom';

const UserHistoryRedeemVoucher = () => {
 const navigate=useNavigate();
  const [history, setHistory] = useState<redeemHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 5;

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await rewardUserApi.getHistoryLoyalPoint(page, limit);
      
      if (response.data?.success || response.status === 200) {
        const resData = response.data?.data;
        if (resData) {
          const historyList = resData.history 
          setHistory(historyList);
          
          const totalItems = resData.pagination?.total_items 
          setTotal(totalItems);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử điểm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const totalPages = Math.ceil(total / limit) || 1;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
      case 'refund':
        return <ArrowUpRight className="text-emerald-500" size={24} />;
      case 'redeem':
        return <ArrowDownRight className="text-rose-500" size={24} />;
      default:
        return <Coins className="text-blue-500" size={24} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earn':
      case 'refund':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'redeem':
        return 'text-rose-600 bg-rose-50 border-rose-100';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const formatPoints = (points?: number, type?: string) => {
    if (!points) return '0';
    if (type === 'redeem') return `${points}`;
    return `+${points}`;
  };

  const getTransactionLabel = (type?: string) => {
    switch (type) {
      case 'earn': return 'Tích điểm';
      case 'refund': return 'Hoàn điểm';
      case 'redeem': return 'Đổi điểm';
      default: return 'Giao dịch';
    }
  };

  

  return (
    <section className='space-y-6'>
        <button 
          onClick={() => navigate(-1)} 
          className='flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#b95b2d] transition-colors'
        >
            <ArrowLeft size={16} />
            Quay lại
        </button>
      <div>
        <p className='text-sm font-bold uppercase tracking-[0.2em] text-[#b95b2d]'>Lịch sử điểm thưởng</p>
        <h2 className='mt-1 text-3xl font-extrabold text-slate-800'>Biến động điểm</h2>
      </div>
      
      <div className='flex flex-col gap-4'>
        {loading ? (
          <div className='flex justify-center items-center py-10'>
            <div className='w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : history && history.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {history.map((item, index) => (
                <div key={item.history_id || index} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full border ${getTransactionColor(item.transaction_type || '')}`}>
                      {getTransactionIcon(item.transaction_type || '')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-800">{getTransactionLabel(item.transaction_type)}</h4>
                        {item.reference_code && (
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Mã: {item.reference_code}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                      {item.created_at && (
                         <p className="text-xs text-slate-400 mt-1.5 font-medium">
                           {parseToDayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
                         </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="shrink-0 ml-14 sm:ml-0">
                    <span className={`text-lg font-bold ${item.transaction_type === 'redeem' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {formatPoints(item.points_changed, item.transaction_type)} điểm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300'>
            <History size={48} className="text-slate-200 mb-3" />
            <p className='text-slate-500 font-medium'>Chưa có lịch sử biến động điểm nào.</p>
          </div>
        )}

        {!loading && total > limit && (
          <div className='flex items-center justify-center gap-4 mt-4'>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${page === 1 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Trang trước
            </button>
            <span className='text-sm font-medium text-slate-500'>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${page === totalPages ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserHistoryRedeemVoucher;

import { useEffect, useState } from "react";
import { userApi } from "../api/user-api"; 
import OrderTrackingCard from "@/component/OrderTrackingCard"; 

interface Pagination {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
}

const UserOrderTracking = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTrackingOrders = async (pageNumber: number) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Gọi API lấy danh sách tổng quan
      const response = await userApi.getOrderHistory(pageNumber, "tracking", "physical");
      const orderList: any[] = response.data?.data?.orders || response.data?.orders || [];
      const paginationData: Pagination = response.data?.data?.pagination || response.data?.pagination || null;
      setPagination(paginationData);

      // Định nghĩa các trạng thái hợp lệ cần giữ lại ở trang Theo dõi đơn hàng
      const trackingStatuses = ["pending", "processing", "shipping"];

      // Lọc danh sách đơn hàng ngay từ đầu dựa trên danh sách gốc của API
      const filteredOrders = orderList.filter((order) => {
        const rawStatus = order.status || order.trang_thai;
        if (!rawStatus) return false;
        return trackingStatuses.includes(String(rawStatus).toLowerCase().trim());
      });

      // 2. Gọi API getOrderDetail song song để lấy mảng items sản phẩm
      const fullOrdersWithItems = await Promise.all(
        filteredOrders.map(async (order) => {
          try {
            const detailResponse = await userApi.getOrderDetail(order.order_id);
            const orderDetail = detailResponse.data?.data || detailResponse.data || {};

            // Xác định chính xác trạng thái từ danh sách (để không bị data chi tiết ghi đè sai lệch)
            const currentStatus = String(order.status || order.trang_thai || "").toLowerCase().trim();
            const method = String(order.payment_method || "").toLowerCase().trim();
            
            let allowCancel = false;
            let allowRefund = false;

            if (currentStatus === "pending" || currentStatus === "processing") {
              allowCancel = true; 
              if (method === "momo") allowRefund = true;
            }

            // Đường dẫn lấy mảng items chuẩn xác từ log thực tế: orderDetail.order.items
            const itemsData = orderDetail.order?.items || orderDetail.items || order.items || [];

            // Trả về object sạch: Ưu tiên giữ cấu trúc của order gốc để tránh bị lệch tab
            return { 
              ...order, 
              items: itemsData,
              allowCancel, 
              allowRefund 
            };
          } catch (detailError) {
            console.error(`Lỗi khi lấy chi tiết đơn hàng #${order.order_id}:`, detailError);
            return { ...order, items: order.items || [] };
          }
        })
      );

      // Cập nhật state với danh sách đơn hàng đã được bóc tách items thành công và lọc đúng trạng thái vận chuyển
      setOrders(fullOrdersWithItems);
    } catch (error: any) {
      console.error("Lỗi API kết nối đơn hàng:", error);
      setErrorMsg(error?.response?.data?.message || error?.message || "Đã xảy ra lỗi kết nối hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingOrders(currentPage);
  }, [currentPage]);

  const handleRemoveOrderFromUI = (cancelledOrderId: string | number) => {
    setOrders((prevOrders) => prevOrders.filter(o => o.order_id !== cancelledOrderId));
    setTimeout(() => {
      fetchTrackingOrders(currentPage);
    }, 500);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="space-y-5 text-left w-full max-w-5xl mx-auto p-4 box-border">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b95b2d]">
          Theo dõi đơn hàng
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-[#1f1935]">
          Trạng thái vận chuyển
        </h2>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 font-mono">
          <strong>Lỗi hệ thống:</strong> {errorMsg}
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-amber-100 bg-[#fffaf4] p-5 flex flex-col gap-3 min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center py-10 m-auto">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10 m-auto">
            Hiện tại không có đơn hàng nào đang trong quá trình vận chuyển.
          </p>
        ) : (
          <div className="flex flex-col gap-4 w-full box-border">
            {orders.map((order, idx) => (
              <OrderTrackingCard 
                key={order.order_id || idx} 
                order={order} 
                onRefresh={() => handleRemoveOrderFromUI(order.order_id)} 
              />
            ))}
          </div>
        )}
      </div>

      {pagination && pagination.total_pages > 5 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-amber-200 disabled:opacity-40 text-amber-700 hover:bg-amber-50 cursor-pointer"
          >
            ← Trước
          </button>
          <span className="text-sm text-gray-500">Trang {currentPage} / {pagination.total_pages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.total_pages}
            className="px-3 py-1.5 rounded-lg text-sm border border-amber-200 disabled:opacity-40 text-amber-700 hover:bg-amber-50 cursor-pointer"
          >
            Sau →
          </button>
        </div>
      )}
    </section>
  );
};

export default UserOrderTracking;
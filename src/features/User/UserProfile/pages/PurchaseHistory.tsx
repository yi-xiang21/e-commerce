import { useCallback, useEffect, useState } from "react";
import { userApi } from "../api/user-api";
import OrderHistoryCard from "@/component/OrderHistoryCard";

interface Pagination {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
}

const PurchaseHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await userApi.getOrderHistory(page, "history", "physical");
      const orderList: any[] = response.data.orders || [];
      const paginationData: Pagination = response.data.pagination;
      setPagination(paginationData);

      const detailedOrders = await Promise.all(
        orderList.map(async (order) => {
          try {
            const detail = await userApi.getOrderDetail(order.order_id);
            return {
              ...order,
              items: detail.data.order?.items || [],
              payment: detail.data.order?.payment || null,
            };
          } catch {
            // Nếu lỗi detail thì vẫn hiển thị order mà không có ảnh
            return order;
          }
        })
      );

      setOrders(detailedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
console.log("orders:", orders);

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b95b2d]">
          Lịch sử mua hàng
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-[#1f1935]">
          Danh sách đơn đã hoàn tất
        </h2>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-[#fffaf4] p-5 flex flex-col gap-3 min-h-50">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Chưa có đơn hàng nào.
          </p>
        ) : (
          orders.map((order) => (
            <OrderHistoryCard key={order.order_id} order={order} />
          ))
        )}
      </div>

      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-amber-200
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-amber-50 transition-colors text-amber-700"
          >
            ← Trước
          </button>

          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors
                ${page === currentPage
                  ? "bg-amber-500 text-white shadow-sm"
                  : "border border-amber-200 text-amber-700 hover:bg-amber-50"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.total_pages}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-amber-200
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-amber-50 transition-colors text-amber-700"
          >
            Sau →
          </button>
        </div>
      )}

      {pagination && (
        <p className="text-center text-xs text-gray-400">
          Trang {pagination.current_page} / {pagination.total_items} đơn hàng
        </p>
      )}
    </section>
  );
};

export default PurchaseHistory;

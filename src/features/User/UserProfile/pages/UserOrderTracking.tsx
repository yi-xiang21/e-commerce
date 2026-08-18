import { useEffect, useState } from "react";
import { userApi } from "../api/user-api"; 
import OrderTrackingCard from "@/component/OrderTrackingCard";

const ITEMS_PER_PAGE = 5;

const UserOrderTracking = () => {
    const [allOrders, setAllOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchTrackingOrders = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            let allFilteredOrders: any[] = [];
            let page = 1;
            let hasNextPage = true;
            const trackingStatuses = ["pending", "processing", "shipping"];

            while (hasNextPage) {
                const response: any = await userApi.getOrderHistory(page, "tracking", "physical");
                const orderList: any[] = response.data?.data?.orders || response.data?.orders || [];
                const paginationData = response.data?.data?.pagination || response.data?.pagination || null;

                const matchedOrders = orderList.filter((order) => {
                    const rawStatus = order.status || order.trang_thai;
                    if (!rawStatus) return false;
                    return trackingStatuses.includes(String(rawStatus).toLowerCase().trim());
                });

                allFilteredOrders = [...allFilteredOrders, ...matchedOrders];

                if (paginationData && page < paginationData.total_pages) {
                    page++;
                } else {
                    hasNextPage = false;
                }
            }

            const fullOrdersWithItems = await Promise.all(
                allFilteredOrders.map(async (order) => {
                    try {
                        const detailResponse: any = await userApi.getOrderDetail(order.order_id);
                        const orderDetail = detailResponse.data?.data || detailResponse.data || {};

                        const currentStatus = String(
                            orderDetail.order?.status || orderDetail.status || order.status || ""
                        ).toLowerCase().trim();

                        let allowCancel = false;
                        if (currentStatus === "pending") {
                            allowCancel = true;
                        }

                        const itemsData = orderDetail.order?.items || orderDetail.items || order.items || [];

                        return {
                            ...order,
                            status: currentStatus,
                            items: itemsData,
                            allowCancel,
                        };
                    } catch (detailError) {
                        console.error(`Không thể lấy chi tiết đơn hàng #${order.order_id}:`, detailError);
                        return { ...order, items: order.items || [] };
                    }
                })
            );

            setAllOrders(fullOrdersWithItems);
        } catch (error: any) {
            setErrorMsg(error?.response?.data?.message || error?.message || "Đã xảy ra lỗi kết nối hệ thống.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrackingOrders();
    }, []);

    const handleCancelOrderTotal = async (cancelledOrderId: string | number): Promise<string> => {
        try {
            setErrorMsg(null);
            const response: any = await userApi.cancelOrder(cancelledOrderId, { status: "cancelled" });
            
            // Xử lý an toàn tránh lỗi type trên AxiosResponse object
            const successMsg = response?.data?.message || response?.message || 'Hủy đơn hàng thành công.';
            return successMsg;
        } catch (error: any) {
            console.error("Lỗi hệ thống hủy đơn tại file cha:", error);
            const serverMsg = error?.response?.data?.message || "Không thể hủy đơn hàng do lỗi hệ thống.";
            setErrorMsg(serverMsg);
            throw error;
        }
    };

    const handleRemoveOrderFromUI = (orderId: string | number) => {
        const updatedOrders = allOrders.filter(o => o.order_id !== orderId);
        setAllOrders(updatedOrders);

        const newTotalPages = Math.ceil(updatedOrders.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        }
    };

    const totalPages = Math.ceil(allOrders.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentOrders = allOrders.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <section className="space-y-5 text-left w-full max-w-5xl mx-auto p-4 box-border">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b95b2d]">Theo dõi đơn hàng</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#1f1935]">Trạng thái vận chuyển</h2>
            </div>

            {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 font-medium">
                    <strong>Thông báo hệ thống:</strong> {errorMsg}
                </div>
            )}

            <div className="rounded-2xl border border-dashed border-amber-100 bg-[#fffaf4] p-5 flex flex-col gap-3 min-h-50">
                {loading ? (
                    <div className="flex justify-center items-center py-10 m-auto">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : currentOrders.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-10 m-auto">Hiện tại không có đơn hàng nào.</p>
                ) : (
                    <div className="flex flex-col gap-4 w-full box-border">
                        {currentOrders.map((order, idx) => (
                            <OrderTrackingCard
                                key={order.order_id || idx}
                                order={order}
                                onCancelOrder={handleCancelOrderTotal}
                                onRemoveOrder={handleRemoveOrderFromUI}
                            />
                        ))}
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-3">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-7 h-7 flex items-center justify-center rounded-md disabled:opacity-30 hover:bg-slate-100 text-slate-500"
                    >
                        &larr;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 rounded-md text-xs font-medium ${page === currentPage ? "border-2 border-orange-300 text-orange-300 font-bold" : "text-slate-600 hover:bg-slate-100"}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="w-7 h-7 flex items-center justify-center rounded-md disabled:opacity-30 hover:bg-slate-100 text-slate-500"
                    >
                        &rarr;
                    </button>
                </div>
            )}
        </section>
    );
};

export default UserOrderTracking;
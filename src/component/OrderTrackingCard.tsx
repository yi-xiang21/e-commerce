import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CancelOrderModals } from "./CancelOrderModals";
import { userApi } from "@/features/User/UserProfile/api/user-api";

interface OrderSummary {
    order_id: string | number;
    status: string;
    total_amount: string | number;
    discount_amount: string | number;
    customer_name: string;
    shipping_address: string;
    shipping_method?: string;
    phone_number?: string;
    allowCancel?: boolean;
    allowRefund?: boolean;
    payment_method?: string;
    items?: {
        item_id: string | number;
        variant_id: string | number;
        product_name: string;
        price: string | number;
        quantity: number;
        color: string;
        size: string;
        product_id: string | number;
        description: string;
        type_name: string;
        image_url: string;
    }[];
}

interface OrderTrackingCardProps {
    order?: OrderSummary;
    onRefresh?: () => void;
}

const statusLabel: Record<string, { text: string; bg: string; textClass: string }> = {
    pending: { text: "Chờ xác nhận", bg: "bg-orange-50", textClass: "text-orange-600" },
    processing: { text: "Đang xử lý", bg: "bg-blue-50", textClass: "text-blue-600" },
    shipping: { text: "Đang giao", bg: "bg-indigo-50", textClass: "text-indigo-600" },
    delivered: { text: "Đã giao", bg: "bg-green-50", textClass: "text-green-600" },
    cancelled: { text: "Đã huỷ", bg: "bg-red-100", textClass: "text-red-600" },
};

const paymentLabel: Record<string, { text: string; bg: string; textClass: string }> = {
    MOMO: { text: "MoMo", bg: "bg-pink-50", textClass: "text-pink-600 font-bold" },
    COD: { text: "COD", bg: "bg-green-50", textClass: "text-green-600 font-bold" },
};

const formatPrice = (price: string | number | undefined) => {
    if (price === undefined || price === null) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(Number(price));
};

const OrderTrackingCard = ({ order, onRefresh }: OrderTrackingCardProps) => {
    const navigate = useNavigate();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!order) return null;

    const status = statusLabel[order.status] ?? { text: order.status, bg: "bg-gray-50", textClass: "text-gray-600" };
    const payKey = String(order.payment_method || "COD").toUpperCase();
    const payment = paymentLabel[payKey] ?? { text: payKey, bg: "bg-gray-50", textClass: "text-gray-600 font-bold" };
    const firstItem = order.items?.[0];

    const updateOrderStatusInDB = async (refundData?: { accountName: string; accountNo: string }) => {
        try {
            setLoading(true);

            const payload = {
                status: "cancelled",
                refundInfo: refundData || null
            };

            await userApi.cancelOrder(order.order_id, payload);
            console.log(`Đã gọi API cập nhật trạng thái hủy đơn #${order.order_id} thành "cancelled".`);

            setIsConfirmOpen(false);
            setIsModalOpen(false);
            setIsSuccessOpen(true);
        } catch (error) {
            console.error("Lỗi khi kết nối hệ thống cập nhật trạng thái đơn:", error);
            alert("Có lỗi xảy ra trong quá trình hủy đơn từ Server, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmCancelAction = () => {
        if (order.allowRefund) {
            setIsConfirmOpen(false);
            setIsModalOpen(true);
        } else {
            updateOrderStatusInDB();
        }
    };

    const handleRefundSubmit = (info: { accountName: string; accountNo: string }) => {
        updateOrderStatusInDB(info);
    };

    const handleCloseSuccessAndRedirect = () => {
        setIsSuccessOpen(false);

        // Xóa khỏi trang hiện tại
        if (onRefresh) {
            onRefresh();
        }

    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 w-full flex flex-row items-center justify-between gap-4 text-left box-border">
            {/* ẢNH & THÔNG TIN TIÊU ĐỀ ĐƠN HÀNG */}
            <div className="flex flex-row items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 shrink-0 flex items-center justify-center overflow-hidden">
                    {firstItem?.image_url ? (
                        <img src={firstItem.image_url} alt={firstItem.product_name} className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-mono text-gray-400">#{order.order_id}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.textClass}`}>
                            {status.text}
                        </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {firstItem?.product_name ?? order.customer_name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {order.shipping_address}
                    </p>

                    {firstItem?.product_name && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                            Tên nhận hàng: <span className="font-medium text-gray-700">{order.customer_name}</span>
                        </p>
                    )}

                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.bg} ${payment.textClass}`}>
                            {payment.text}
                        </span>
                    </div>
                </div>
            </div>

            {/* GIÁ TIỀN & NHÓM BUTTON ĐIỀU HƯỚNG */}
            <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Tổng thanh toán</p>
                    <p className="text-base font-bold text-gray-900 tracking-tight">
                        {formatPrice(order.total_amount)}
                    </p>
                </div>

                <div className="flex flex-row items-center gap-2 shrink-0">
                    {order.allowCancel && (
                        <button
                            disabled={loading}
                            onClick={() => setIsConfirmOpen(true)}
                            className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-300 rounded-xl transition active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Đang xử lý..." : "Hủy đơn"}
                        </button>
                    )}
                    <button
                        onClick={() => navigate(`/profile/order-detail/${order.order_id}`)}
                        className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition active:scale-95 cursor-pointer"
                    >
                        Chi tiết
                    </button>
                </div>
            </div>

            <CancelOrderModals
                isConfirmOpen={isConfirmOpen}
                isRefundOpen={isModalOpen}
                isSuccessOpen={isSuccessOpen}
                orderId={order.order_id}
                onCloseConfirm={() => setIsConfirmOpen(false)}
                onCloseRefund={() => setIsModalOpen(false)}
                onCloseSuccess={handleCloseSuccessAndRedirect}
                onConfirmCancel={handleConfirmCancelAction}
                onRefundSubmit={handleRefundSubmit}
            />
        </div>
    );
};

export default OrderTrackingCard;
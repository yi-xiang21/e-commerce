import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../api/user-api";

interface OrderItem {
  item_id: string | number;
  product_name: string;
  price: string | number;
  quantity: number;
  color: string;
  size: string;
  image_url: string;
  sku: string;
  slug: string;
}

interface OrderDetail {
  order_id: string;
  total_amount: string | number;
  discount_amount: string | number;
  shipping_fee: string | number;
  shipping_method: string;
  shipping_address: string;
  customer_name: string;
  phone_number: string;
  status: string;
  items: OrderItem[];
  payment: {
    payment_method: string;
    payment_status: string;
    reference_code: string;
  } | null;
}

const statusLabel: Record<string, { text: string; bg: string; color: string }> = {
  pending:    { text: "Chờ xác nhận", bg: "bg-orange-100", color: "text-orange-600" },
  processing: { text: "Đang xử lý",   bg: "bg-blue-100",   color: "text-blue-600"   },
  shipping:   { text: "Đang giao",    bg: "bg-indigo-100", color: "text-indigo-600" },
  delivered:  { text: "Đã giao",      bg: "bg-green-100",  color: "text-green-600"  },
  completed:  { text: "Hoàn tất",     bg: "bg-green-100",  color: "text-green-700"  },
  cancelled:  { text: "Đã huỷ",       bg: "bg-red-100",    color: "text-red-600"    },
};

const paymentMethodLabel: Record<string, string> = {
  COD:  "Thanh toán khi nhận hàng",
  MOMO: "Ví MoMo",
};

const paymentStatusLabel: Record<string, { text: string; color: string }> = {
  paid:    { text: "Đã thanh toán", color: "text-green-600" },
  pending: { text: "Chờ thanh toán", color: "text-orange-500" },
  failed:  { text: "Thất bại",       color: "text-red-500"   },
};

const formatPrice = (price: string | number | undefined) => {
  if (price === undefined || price === null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(price));
};

const DetailPurchaseHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await userApi.getOrderDetail(id);
      setOrder(response.data.order);
    } catch (error) {
      console.error("Error fetching order detail:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">Không tìm thấy đơn hàng.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-amber-600 underline"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const status = statusLabel[order.status] ?? { text: order.status, bg: "bg-gray-100", color: "text-gray-600" };
  const subTotal = order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <section className="space-y-6 max-w-3xl">
      
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 transition-colors mb-2 pb-3 cursor-pointer"
          >
            ← Quay lại
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b95b2d]">
            Chi tiết đơn hàng
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#1f1935]">#{order.order_id}</h2>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
          {status.text}
        </span>
      </div>

      
      <div className="rounded-2xl border border-amber-100 bg-[#fffaf4] overflow-hidden">
        <div className="px-5 py-3 border-b border-amber-100">
          <p className="text-sm font-semibold text-gray-700">Sản phẩm</p>
        </div>
        <div className="overflow-y-auto max-h-96">
          {order.items.map((item) => (
            <div key={item.item_id} className="flex items-center gap-4 px-5 py-4">
              
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Ảnh</div>
                )}
              </div>

              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.product_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Màu: <span className="font-medium">{item.color}</span>
                  &nbsp;·&nbsp;
                  Size: <span className="font-medium">{item.size}</span>
                  &nbsp;·&nbsp;
                  SKU: <span className="font-medium">{item.sku}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Số lượng: {item.quantity}</p>
              </div>

             
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">{formatPrice(Number(item.price) * item.quantity)}</p>
                <p className="text-xs text-gray-400">{formatPrice(item.price)} / cái</p>
              </div>
            </div>
          ))}
        </div>
      </div>

     
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        
        <div className="rounded-2xl border border-amber-100 bg-[#fffaf4] p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-700 border-b border-amber-100 pb-2">
            Thông tin nhận hàng
          </p>
          <InfoRow label="Người nhận" value={order.customer_name} />
          <InfoRow label="Số điện thoại" value={order.phone_number} />
          <InfoRow label="Địa chỉ" value={order.shipping_address} />
          <InfoRow label="Phương thức giao" value={order.shipping_method} />
        </div>

        
        <div className="rounded-2xl border border-amber-100 bg-[#fffaf4] p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-700 border-b border-amber-100 pb-2">
            Thanh toán
          </p>
          {order.payment ? (
            <>
              <InfoRow
                label="Phương thức"
                value={paymentMethodLabel[order.payment.payment_method] ?? order.payment.payment_method}
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Trạng thái</span>
                <span className={`font-semibold ${paymentStatusLabel[order.payment.payment_status]?.color ?? "text-gray-600"}`}>
                  {paymentStatusLabel[order.payment.payment_status]?.text ?? order.payment.payment_status}
                </span>
              </div>
              <InfoRow label="Mã tham chiếu" value={order.payment.reference_code} />
            </>
          ) : (
            <p className="text-xs text-gray-400">Chưa có thông tin thanh toán.</p>
          )}
        </div>
      </div>

      
      <div className="rounded-2xl border border-amber-100 bg-[#fffaf4] p-5 space-y-2">
        <p className="text-sm font-semibold text-gray-700 border-b border-amber-100 pb-2">
          Tóm tắt đơn hàng
        </p>
        <SummaryRow label="Tạm tính" value={formatPrice(subTotal)} />
        <SummaryRow label="Phí vận chuyển" value={formatPrice(order.shipping_fee)} />
        {Number(order.discount_amount) > 0 && (
          <SummaryRow label="Giảm giá" value={`- ${formatPrice(order.discount_amount)}`} className="text-green-600" />
        )}
        <div className="flex justify-between items-center pt-2 border-t border-amber-100 mt-2">
          <span className="text-base font-bold text-gray-900">Tổng cộng</span>
          <span className="text-base font-bold text-amber-600">{formatPrice(order.total_amount)}</span>
        </div>
      </div>
    </section>
  );
};


const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between items-start text-xs gap-2">
    <span className="text-gray-500 shrink-0">{label}</span>
    <span className="font-medium text-gray-800 text-right">{value || "—"}</span>
  </div>
);

const SummaryRow = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={`font-medium text-gray-900 ${className}`}>{value}</span>
  </div>
);

export default DetailPurchaseHistory;
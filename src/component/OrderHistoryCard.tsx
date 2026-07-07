import { useNavigate } from "react-router-dom";

// Dữ liệu từ API danh sách đơn hàng (GET /order-history)
interface OrderSummary {
  order_id: string | number;
  status: string;
  total_amount: string | number;
  discount_amount: string | number;
  customer_name: string;
  shipping_address: string;
  shipping_method?: string;
  phone_number?: string;
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
  payment?: {
    payment_method: string;
    payment_status: string;
    reference_code: string;
  };
}

interface OrderHistoryCardProps {
  order?: OrderSummary;
}

const statusLabel: Record<string, { text: string; color: string }> = {
  pending:    { text: "Chờ xác nhận", color: "text-orange-500" },
  processing: { text: "Đang xử lý",   color: "text-blue-500"   },
  shipping:   { text: "Đang giao",    color: "text-indigo-500" },
  delivered:  { text: "Đã giao",      color: "text-green-600"  },
  completed:  { text: "Hoàn tất",     color: "text-green-700"  },
  cancelled:  { text: "Đã huỷ",       color: "text-red-500"    },
};

const formatPrice = (price: string | number | undefined) => {
  if (price === undefined || price === null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));
};

const OrderHistoryCard = ({ order }: OrderHistoryCardProps) => {
  const navigate = useNavigate();
  if (!order) return null;

  const status = statusLabel[order.status] ?? { text: order.status, color: "text-gray-500" };
  const firstItem = order.items?.[0];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border border-gray-100 max-w-5xl mx-auto w-full gap-4">
      
      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
        {firstItem?.image_url ? (
          <img
            src={firstItem.image_url}
            alt={firstItem.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            Ảnh
          </div>
        )}
      </div>

      
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">#{order.order_id}</p>
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {firstItem?.product_name ?? order.customer_name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {order.shipping_address}
        </p>
      </div>

      
      <div className={`text-xs font-semibold shrink-0 ${status.color}`}>
        {status.text}
      </div>

      
      <div className="text-base font-bold text-gray-900 shrink-0">
        {formatPrice(order.total_amount)}
      </div>

      
      <button
        onClick={() => navigate(`/profile/order-detail/${order.order_id}`)}
        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-4 py-2 rounded-full shadow-sm transition duration-150 shrink-0 cursor-pointer"
      >
        Chi tiết
      </button>
    </div>
  );
};

export default OrderHistoryCard;
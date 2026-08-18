export const ORDER_STATUS_OPTIONS = [
  { label: 'Chờ xử lý (Pending)', value: 'pending' },
  { label: 'Đang xử lý (Processing)', value: 'processing' },
  { label: 'Đang giao (Shipping)', value: 'shipping' },
  { label: 'Hoàn thành (Completed)', value: 'completed' },
  { label: 'Đã hủy (Cancelled)', value: 'cancelled' },
] as const;
export type OrderStatusValue = typeof ORDER_STATUS_OPTIONS[number]["value"];

export interface OrderItem {
  item_id: number;
  variant_id: number;
  product_id?: number;
  product_name: string;
  sku?: string;
  slug?: string;
  category_name?: string;
  type_name?: string;
  color?: string;
  size?: string;
  price: string;
  quantity: number;
  description?: string;
}

export interface OrderStatus {
  status: OrderStatusValue;
}

export interface OrderPayment {
  payment_method: string;
  payment_status: string;
  reference_code: string | null;
}

export interface Order {
  order_id: string;
  user_id: number;
  status: OrderStatusValue;
  total_amount: string;
  customer_name: string;
  phone_number: string;
  voucher_id?: number | null;
  discount_amount?: string | null;
  ward_id?: number;
  shipping_address?: string;
  shipping_fee?: string;
  items?: OrderItem[];
  payment?: OrderPayment;
}

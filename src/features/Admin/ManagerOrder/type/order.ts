import { ORDER_STATUS_OPTIONS } from '../constants/orderStatus';

export type OrderStatusValue = typeof ORDER_STATUS_OPTIONS[number]['value'];

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
  items?: OrderItem[];
  payment?: OrderPayment;
}

export interface OrderListResponse {
  success: boolean;
  message?: string;
  data: {
    orders: Order[];
    pagination: {
      total_items: number;
      total_pages: number;
      current_page: number;
      limit: number;
    };
  };
}

export interface OrderDetailResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

export interface OrderFilterPayload {
  keyword?: string;
  statuses?: string[];
  page: number;
  limit: number;
}

export interface OrderStatusUpdate {
  status: OrderStatusValue;
}
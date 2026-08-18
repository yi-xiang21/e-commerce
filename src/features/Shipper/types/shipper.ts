export interface ShipperProfile {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  shipper_code: string;
  cccd: string;
  license_plate: string;
  personal_address: string;
  working_city_id: string;
}

export interface ShipperProfileUpdate {
  full_name: string;
  phone: string;
  personal_address: string;
  cccd: string;
  license_plate: string;
}

export interface AvailableOrder {
  order_id: string;
  pickup_address: string;
  delivery_address: string;
  shipping_fee: number;
  cod_amount: string;
  status: string;
}

export interface MyDelivery {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  cod_amount: string;
  delivery_status: string;
  accepted_at: string;
  completed_at: string | null;
}

export interface OrderItem {
  product_name: string;
  color: string;
  size: string;
  quantity: number;
  price: string;
  image_url: string;
}

export interface OrderDetail {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  cod_amount: string;
  payment_method: string;
  delivery_status: string;
  failed_reason: string | null;
  accepted_at: string;
  completed_at: string | null;
  shipping_fee: string;
  total_amount: string;
  items: OrderItem[];
}
export interface ShipperProfile {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar: string;
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
}

export interface AvailableOrder {
  order_id: string;
  pickup_address: string;
  delivery_address: string;
  shipping_fee: number;
  cod_amount: string;
  status: string;
}
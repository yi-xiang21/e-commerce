import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { Order } from "@/features/Admin/ManagerOrder/type/order";
import { ORDER_STATUS_OPTIONS } from "./orderStatus";

export const orderFields: FormField<Order>[] = [
  { key: 'order_id', label: 'Mã đơn hàng', type: FormFieldType.Input },
  { key: 'customer_name', label: 'Tên khách hàng', type: FormFieldType.Input },
  { key: 'phone_number', label: 'Số điện thoại', type: FormFieldType.Input },
  { key: 'shipping_address', label: 'Địa chỉ giao', type: FormFieldType.Input },
  { key: 'total_amount', label: 'Tổng tiền', type: FormFieldType.Input },
  { key: 'payment_method' as any, label: 'Phương thức thanh toán', type: FormFieldType.Input },
  { key: 'payment_status' as any, label: 'Trạng thái thanh toán', type: FormFieldType.Input },
  {
    key: 'status',
    label: 'Trạng thái đơn hàng',
    type: FormFieldType.Select,
    options: [...ORDER_STATUS_OPTIONS],
    rules: [{ required: true, message: 'Vui lòng chọn trạng thái' }]
  }
];
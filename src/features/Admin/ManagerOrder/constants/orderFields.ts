import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { Order } from "@/features/Admin/ManagerOrder/type/order";
import { ORDER_STATUS_OPTIONS } from "./orderStatus";

export const orderFields: FormField<Order>[] = [
  {
    key: 'status',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    options: [...ORDER_STATUS_OPTIONS],
    rules: [
      {
        required: true,
        validator: (formdata: Order) => {
          return !!formdata.status?.trim();
        },
        message: 'Trạng thái không được để trống.',
      }
    ]
  }
];
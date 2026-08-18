import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";

export const filterStocks: FilterField[] = [
  {
    key: 'keyword',
    label: 'Tìm kiếm',
    type: FormFieldType.Input,
    placeholder: 'Nhập từ khóa...',
  },
  {
    key:'stock_status',
    label: 'Trạng thái kho',
    type: FormFieldType.Select,
    options: [
      { label: 'Còn hàng', value: 'in_stock' },
      { label: 'Tồn thấp', value: 'low_stock' },
      { label: 'Hết hàng', value: 'out_of_stock' },
    ],
  }
];
  
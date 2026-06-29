import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";


export const filterPromotion: FilterField[] = [
  {
    key: 'keyword',
    label: 'Tìm kiếm',
    type: FormFieldType.Input,
    placeholder: 'Nhập từ khóa...',
  },
  {
    key: 'statuses',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    placeholder: 'Chọn trạng thái',
    width: 200,
    options: [
      { label: 'Đang hoạt động', value: 'active' },
      { label: 'Ngừng hoạt động', value: 'inactive' },
    ],
    
  },
  {
    key: 'discount_type',
    label: 'Loại giảm giá',
    type: FormFieldType.Select,
    placeholder: 'Chọn loại giảm giá',
    width: 200,
    options: [
      { label: 'Phần trăm', value: 'percent' },
      { label: 'Số tiền', value: 'fixed' },
    ],
  }
];
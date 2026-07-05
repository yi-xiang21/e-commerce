import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";

export const filterVoucher: FilterField[] = [
    {
        key: 'keyword',
        label: 'Tìm kiếm',
        type: FormFieldType.Input,
        placeholder: 'Nhập từ khóa...',
    },
    {
        key: 'discount_type',
        label: 'Loại voucher',
        type: FormFieldType.Select,
        placeholder: 'Chọn loại voucher',
        width: 200,
        options: [
        { label: 'Phần trăm', value: 'percent' },
        { label: 'Số tiền', value: 'fixed' },
        ],
  }
];
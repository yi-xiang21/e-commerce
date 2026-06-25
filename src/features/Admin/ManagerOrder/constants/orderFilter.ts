import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";
import { ORDER_STATUS_OPTIONS } from "./orderStatus";

export const filterOrder: FilterField[] = [
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
    options: [...ORDER_STATUS_OPTIONS],
    mode: 'multiple',
  },
];
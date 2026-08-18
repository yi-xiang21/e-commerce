import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";

// Định nghĩa các trường của form lọc tài khoản
export const filterAccount: FilterField[] = [
  {
    // Khóa của trường, tương ứng với thuộc tính trong interface account
    key: 'keyword',
    // Nhãn hiển thị cho trường tìm kiếm
    label: 'Tìm kiếm',
    // Loại trường là input
    type: FormFieldType.Input,
    // Placeholder cho trường tìm kiếm
    placeholder: 'Nhập từ khóa...',
  },
  {
    // Khóa của trường, tương ứng với thuộc tính trong interface account
    key : 'roles',
    // Nhãn hiển thị cho trường vai trò
    label: 'Vai trò',
    // Loại trường là select
    type: FormFieldType.Select,
    // Placeholder cho trường vai trò
    placeholder: 'Chọn vai trò',
    // Độ rộng của trường vai trò
    width: 200,
    // Các tùy chọn cho trường vai trò
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'customer', value: 'customer' },
      {
        label: 'Shipper',
        value: 'shipper',
      }
    ],
    // Chế độ chọn nhiều cho trường vai trò
    mode: 'multiple',
  },
  {
    key: 'statuses',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    placeholder: 'Chọn trạng thái',
    width: 200,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    mode: 'multiple',
  },
];
  
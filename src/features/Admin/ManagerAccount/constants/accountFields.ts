import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { account } from "@/features/Admin/ManagerAccount/type/account";


// Định nghĩa các trường của form quản lý tài khoản
export const accountFields: FormField<account>[] = [
  {
      // Khóa của trường, tương ứng với thuộc tính trong interface account
      key: 'username',
      // Nhãn hiển thị cho trường username

      label: 'Tên đăng nhập',
      // Loại trường là input

      type: FormFieldType.Input,
      // Placeholder cho trường username

      placeholder: 'Nhập tên username',

      // Validation rules cho trường username
      rules: [
        {
          // Trường username là bắt buộc
          required: true,
          // Validator kiểm tra nếu username không phải là chuỗi rỗng hoặc chỉ chứa khoảng trắng
          validator: (formdata:account) => {
          return !!formdata.username?.trim();
          },
          // Thông báo lỗi nếu username không hợp lệ
          message: 'Tên không được để trống hoặc chỉ chứa khoảng trắng.',
        }
      ]
    },

  {
    // Khóa của trường, tương ứng với thuộc tính trong interface account
    key: 'first_name',

    // Nhãn hiển thị cho trường first_name
    label: 'Tên',

    // Placeholder cho trường first_name
    placeholder: 'Nhập tên',

    // Loại trường là input
    type: FormFieldType.Input,
    
  },

  {
    // Khóa của trường, tương ứng với thuộc tính trong interface account
    key: 'last_name',
    // Nhãn hiển thị cho trường last_name
    label: 'Họ',
    // Placeholder cho trường last_name
    placeholder: 'Nhập họ',
    // Loại trường là input
    type: FormFieldType.Input,
  },
  {
    // Khóa của trường, tương ứng với thuộc tính trong interface account
    key: 'email',
    // Nhãn hiển thị cho trường email
    label: 'Email',
    // Placeholder cho trường email
    placeholder: 'Nhập email',
    // Loại trường là input
    type: FormFieldType.Input,
    // Validation rules cho trường email
    rules: [
      {
        required: true,
        validator: (formdata:account) => {
          return !!formdata.email?.trim();
        },
        message: 'Email không được để trống hoặc chỉ chứa khoảng trắng.',
      },
      {
        // Pattern regex để kiểm tra định dạng email hợp lệ
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        // Thông báo lỗi nếu email không hợp lệ
        message: 'Email không hợp lệ.',
      },
    ],
  },
  {
    key: 'password',
    label: 'Mật khẩu',
    placeholder: 'Nhập mật khẩu',
    type: FormFieldType.InputPassword,
    rules: [
      {
        required: true,
        validator: (formdata:account) => {
          return !!formdata.password?.trim();
        },
        message: 'Mật khẩu không được để trống hoặc chỉ chứa khoảng trắng.',
      },
      {
        pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
        message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ và số.',
      },
    ],
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
    placeholder: 'Nhập số điện thoại',
    type: FormFieldType.Input,
    rules: [
      {
        required: true,
        validator: (formdata:account) => {
          return !!formdata.phone_number?.trim();
        },
        message: 'Số điện thoại không được để trống hoặc chỉ chứa khoảng trắng.',
      },
      {
        pattern: /^\d{10}$/,
        message: 'Số điện thoại phải có 10 chữ số.',
      },
    ],
    
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    options: [
      { label: 'Hoạt động', value: 'active' },
      { label: 'Không hoạt động', value: 'inactive' },
    ],
  },
  {
    key: 'role',
    label: 'Vai trò',
    type: FormFieldType.Select,
    options: [
      { label: 'Khách hàng', value: 'customer' },
      { label: 'Quản trị viên', value: 'admin' },
    ],
  }
  
];
import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { shipper } from '../type/shipper';
import { orderApi } from "@/features/User/UserOrder/api/order-api";



export const shipperFields: FormField<shipper>[] = [
  {
    key: 'full_name',
    label: 'Họ tên',
    type: FormFieldType.Input,
    placeholder: 'Nhập họ tên',
    rules: [
      {
        required: true,
        validator: (formdata: shipper) => {
          return !!formdata.full_name?.trim();
        },
        message: 'Họ tên không được để trống hoặc chỉ chứa khoảng trắng.',
      }
    ]
  },
  {
    key: 'phone',
    label: 'Số điện thoại',
    type: FormFieldType.Input,
    placeholder: 'Nhập số điện thoại',
    rules: [
      {
        required: true,
        validator: (formdata: shipper) => {
          return !!formdata.phone?.trim();
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
    key: 'email',
    label: 'Email',
    type: FormFieldType.Input,
    placeholder: 'Nhập email',
    rules: [
      {
        required: true,
        validator: (formdata: shipper) => {
          return !!formdata.email?.trim();
        },
        message: 'Email không được để trống hoặc chỉ chứa khoảng trắng.',
      },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email không hợp lệ.',
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
    rules: [
      {
        required: true,
        message: 'Trạng thái không được để trống.',
      },
    ],
  },
  {
    key: 'working_city_id',
    label: 'Thành phố làm việc',
    type: FormFieldType.SelectFetch,
    fetchOptions: async () => {
      const response = await orderApi.getCities();
      const cities = response.data.data.cities;
      return cities.map((city: any) => ({
        label: city.city_name,
        value: city.city_code,
      }));
    },
    rules: [
      {
        required: true,
        message: 'Thành phố làm việc không được để trống.',
      },
    ],
  },
];
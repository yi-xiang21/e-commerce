import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { OrderItem } from '@/features/Admin/ManagerOrder/type/order';

export const orderChildrenFields: FormField<OrderItem>[] = [
  {
    key: 'sku',
    label: 'Mã SKU',
    type: FormFieldType.Input,
  },
  {
    key: 'product_name',
    label: 'Tên sản phẩm',
    type: FormFieldType.Input,
  },
  {
    key: 'category_name',
    label: 'Danh mục',
    type: FormFieldType.Input,
  },
  {
    key: 'color',
    label: 'Màu sắc',
    type: FormFieldType.Input,
  },
  {
    key: 'size',
    label: 'Kích cỡ',
    type: FormFieldType.Input,
  },
  {
    key: 'price',
    label: 'Đơn giá',
    type: FormFieldType.Input,
  },
  {
    key: 'quantity',
    label: 'Số lượng',
    type: FormFieldType.Input,
  }
];
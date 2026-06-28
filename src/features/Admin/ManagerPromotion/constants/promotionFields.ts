import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { promotion } from "@/features/Admin/ManagerPromotion/type/Promotion";



export const promotionFields: FormField<promotion>[] = [
  { key: 'promotion_id', label: 'Mã khuyến mãi', type: FormFieldType.Input, rules: [{ required: true, message: 'Mã khuyến mãi là bắt buộc' }] },
  { key: 'title', label: 'Tên khuyến mãi', type: FormFieldType.Input ,rules: [{ required: true, message: 'Tên khuyến mãi là bắt buộc' }]},
  { key: 'discount_type', label: 'Loại giảm giá', type: FormFieldType.Select,options:[
    { label: 'Phần trăm', value: 'percent' },
    { label: 'Số tiền', value: 'fixed' },
  ], rules: [{ required: true, message: 'Loại giảm giá là bắt buộc' }] },
  { key: 'value', label: 'Giá trị giảm', type: FormFieldType.Input ,rules: [{ required: true, message: 'Giá trị giảm là bắt buộc'},{pattern: /^\d+(\.\d{1,2})?$/, message: 'Giá trị giảm phải là số' }]},
  { key: 'min_order_value', label: 'Giá trị đơn hàng tối thiểu', type: FormFieldType.Input ,rules: [{ required: true, message: 'Giá trị đơn hàng tối thiểu là bắt buộc'},{pattern: /^\d+(\.\d{1,2})?$/, message: 'Giá trị đơn hàng tối thiểu phải là số' }]},
  { key: 'start_date' as any, label: 'Ngày bắt đầu', type: FormFieldType.DatePicker ,rules: [{ required: true, message: 'Ngày bắt đầu là bắt buộc' },
    {
      validator: ( formData: promotion) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const startDate = new Date(formData.start_date);
        startDate.setHours(0, 0, 0, 0);

        return startDate >= today;
      },
        message: 'Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại',
    },
    {
      required: true,
      message: 'Ngày bắt đầu không được để trống',
    }
  ]},
  { key: 'end_date' as any, label: 'Ngày kết thúc', type: FormFieldType.DatePicker, 
    rules: [
      { required: true, message: 'Ngày kết thúc là bắt buộc' }, 
      {
        validator: (formData: promotion) => {
          if (!formData.start_date || !formData.end_date) {
            return true; 
          }
          const startDate = new Date(formData.start_date);
          const endDate = new Date(formData.end_date);
          return endDate > startDate;
        },
        message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      },
      {
        required: true,
        message: 'Ngày kết thúc không được để trống',
      }]
},
  
  { key: 'status' as any, label: 'Trạng thái', type: FormFieldType.Select, options: [
    { label: 'Đang hoạt động', value: 'active' },
    { label: 'Ngừng hoạt động', value: 'inactive' },
  ] },
];
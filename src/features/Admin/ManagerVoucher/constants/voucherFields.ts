import type { FormField } from "@/share/types/form-field";
import type { voucher } from "../type/Voucher";
import { FormFieldType } from "@/share/types/type-form-field";

export const voucherFields: FormField<voucher>[] = [
    {key: 'voucher_id', label: 'Mã voucher', type: FormFieldType.Input, rules: [{ required: true, message: 'Mã voucher là bắt buộc' }]},
    {key: 'code', label: 'Mã code', type: FormFieldType.Input, rules: [{ required: true, message: 'Mã code là bắt buộc' }]},
    {key: 'voucher_name', label: 'Tên voucher', type: FormFieldType.Input, rules: [{ required: true, message: 'Tên voucher là bắt buộc' }]},
    {key: 'discount_type', label: 'Loại voucher', type: FormFieldType.Select, options:[
        { label: 'Phần trăm', value: 'percent' },
        { label: 'Số tiền', value: 'fixed' },
    ], rules: [{ required: true, message: 'Loại voucher là bắt buộc' }]},
    {key: 'value', label: 'Mức voucher', type: FormFieldType.Input, rules: [{ required: true, message: 'Mức voucher là bắt buộc'},{pattern: /^\d+(\.\d{1,2})?$/, message: 'Mức voucher phải là số' }]},
    {key: 'minimum_value', label: 'Giá trị voucher tối thiểu', type: FormFieldType.Input, rules: [{ required: true, message: 'Giá trị voucher tối thiểu là bắt buộc'},{pattern: /^\d+(\.\d{1,2})?$/, message: 'Giá trị vouhcer tối thiểu phải là số' }]},
    {key: 'max_discount', label: 'Giá trị voucher tối đa', type: FormFieldType.Input, rules: [{ required: true, message: 'Giá trị voucher là bắt buộc'},{pattern: /^\d+(\.\d{1,2})?$/, message: 'Giá trị voucher tối đa phải là số' }]},
    {key: 'quantity', label: 'Số lượng voucher', type: FormFieldType.Input, rules: [{ required: true, message: 'Số lượng voucher là bắt buộc'},{pattern: /^\d+$/, message: 'Số lượng voucher phải là số' }]},
    { 
      key: 'start_date' as any, 
      label: 'Ngày bắt đầu', 
      type: FormFieldType.DatePicker,
      rules: [
        { required: true, message: 'Ngày bắt đầu là bắt buộc' },
        {
            validator: ( formData: voucher) => {
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
              validator: (formData: voucher) => {
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
];
import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { CategoryFormValues } from '@/features/Admin/managerCatelogy/type/catelogy';


export const categoryFields: FormField<CategoryFormValues>[] = [
  {
      key: 'category_name',

      label: 'Tên danh mục',

      type: FormFieldType.Input,

      placeholder: 'Nhập tên danh mục',

      rules: [
        {
          required: true,
          validator: (formdata:CategoryFormValues) => {
          return !!formdata.category_name?.trim();
          },
          message: 'Tên danh mục không được để trống hoặc chỉ chứa khoảng trắng.',
        }
      ]
    },

  {
    key: 'description',

    label: 'Mô tả',

    placeholder: 'Nhập mô tả',

    type: FormFieldType.TextArea,
    
  },

  {
    key: 'image_url',

    label: 'URL hình ảnh',

    placeholder: 'Nhập URL hình ảnh',
    
    type: FormFieldType.inputFile,
      rules: [
        {
          required: true,
          message: 'Hình ảnh là bắt buộc.',
        }
      ]

  }

  
];
import type { FormField } from "@/share/types/form-field";
import type { categoryChildren } from "@/features/Admin/managerCatelogy/type/catelogy";
import { FormFieldType } from "@/share/types/type-form-field";


export const childCategoryFields: FormField<categoryChildren>[] = [
  { key: 'category_name', label: 'Tên danh mục con', type: FormFieldType.Input, rules: [
    {
      required: true,
      validator: (formdata:categoryChildren) => {
        return !!formdata.category_name?.trim();
      },
      message: 'Tên danh mục con không được để trống hoặc chỉ chứa khoảng trắng.',
    }
  ]},
  { key: 'description', label: 'Mô tả', type: FormFieldType.TextArea },
];
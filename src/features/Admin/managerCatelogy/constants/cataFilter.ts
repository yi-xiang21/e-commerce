import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";
import {categoryApi} from "@/features/Admin/managerCatelogy/api/cate_api";
export const filterCategory: FilterField[] = [
  {
    key: 'keyword',
    label: 'Tìm kiếm',
    type: FormFieldType.Input,
    placeholder: 'Nhập từ khóa...',
  },
  {
    key : 'parent_category_id',
    label: 'Danh mục cha',
    type: FormFieldType.SelectFetch,
    placeholder: 'Chọn danh mục cha',
    width: 200,
    fetchOptions: async () => {
      try {
        const response = await categoryApi.getAll(1,1000);
        return response.data?.categories .map((category: { id: number; category_name: string }) => ({
          label: category.category_name,
          value: category.id,
        })) || [];
      }
        catch (error) {        
            console.error('Lỗi khi lấy danh mục cha:', error);
        return [];
      }
    },
  }
];
  
import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";
import { API_CONFIG } from '@/config/api';
import { callAPI } from '@/share/lib/axios';

const getLeafCategoryOptions = (categories: any[] = []) => {
  const options: Array<{ label: string; value: number | string }> = [];

  const visit = (items: any[]) => {
    items.forEach((item) => {
      const children = Array.isArray(item?.children) ? item.children : [];
      const value = item?.category_id ?? item?.id;
      const label = item?.category_name ?? item?.name ?? 'Danh mục';

      if (!children.length) {
        options.push({ label, value });
      }

      if (children.length) {
        visit(children);
      }
    });
  };

  visit(categories);
  return options;
};

export const filterProducts: FilterField[] = [
  {
    key: 'keyword',
    label: 'Tìm kiếm',
    type: FormFieldType.Input,
    placeholder: 'Nhập từ khóa...',
  },
  {
    key: 'type_ids',
    label: 'Loại sản phẩm',
    type: FormFieldType.Select,
    placeholder: 'Chọn loại sản phẩm',
    options: [
      { label: 'Len cuộn', value: 1 },
        { label: 'Công cụ', value: 2 },
    ],
    mode: 'multiple',
  },
  {
    key: 'category_id', 
    label: 'Danh mục',
    type: FormFieldType.SelectFetch, 
    placeholder: 'Chọn danh mục',
    width: 200,
   fetchOptions: async () => {
     try {
       const response = await callAPI.get(API_CONFIG.ENDPOINTS.GET_CATEGORIES, {
         params: { page: 1, limit: 1000 },
       });

       const payload = (response as any)?.data ?? response;
       const categories = payload?.categories ?? payload?.data?.categories ?? [];

       return getLeafCategoryOptions(categories);
     } catch (error) {
       console.error(error);
       return [];
     }
   },
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    placeholder: 'Chọn trạng thái',
    width: 200,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
];
  
import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { Product } from '@/features/Admin/ManagerProduct/type/products';
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

export const productFields: FormField<Product>[] = [
  {
      key: 'product_id',

      label: 'ID sản phẩm',
      type: FormFieldType.Input,

      placeholder: 'ID sản phẩm',
  },
  {
      key: 'product_name',

      label: 'Tên sản phẩm',

      type: FormFieldType.Input,

      placeholder: 'Nhập tên sản phẩm',

      rules: [
        {
          required: true,
          validator: (formdata:Product) => {
          return !!formdata.product_name?.trim();
          },
          message: 'Tên không được để trống hoặc chỉ chứa khoảng trắng.',
        }
      ]
    },

  {
    key: 'type_id',

    label: 'Loại sản phẩm',

    placeholder: 'Chọn loại sản phẩm',

    type: FormFieldType.Select,
    options: [
      { label: 'Len cuộn', value: 1 },
      { label: 'Công cụ', value: 2 },
    ], 

    rules: [
      {
        required: true,

        validator: (formdata:Product) => {
          return !!formdata.type_id;
        },

        message: 'Loại sản phẩm là bắt buộc.',
        }
      ]
    
  },

  {
    key: 'category_id',
    label: 'Danh mục',
    placeholder: 'Chọn danh mục',
    type: FormFieldType.SelectFetch,
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
    rules: [
      {
        required: true,
        validator: (formdata:Product) => {
          return !!formdata.category_id;
        },
        message: 'Danh mục là bắt buộc.', 

        }
      ]
  },
  {
    key: 'description',
    label: 'Mô tả',
    placeholder: 'Nhập mô tả sản phẩm',
    type: FormFieldType.TextArea,
    
  },
  {
    key: 'product_status',
    label: 'Trạng thái sản phẩm',
    placeholder: 'Chọn trạng thái sản phẩm',
    type: FormFieldType.Select,
    options: [
      { label: 'active', value: 'active' },
      { label: 'inactive', value: 'inactive' },
    ],
    rules: [
      {
        required: true,
        validator: (formdata:Product) => {
          return !!formdata.product_status?.trim();
        },
        message: 'Trạng thái sản phẩm không được để trống hoặc chỉ chứa khoảng trắng.',
      }
    ],
  }
  
];
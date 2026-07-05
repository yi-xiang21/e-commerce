import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { productPromotion } from '../type/Promotion';

import { ProductApi } from '../../ManagerProduct/api/products_api';
import type { Product } from '../../ManagerProduct/type/products';

export const promotionChildrenFields: FormField<productPromotion>[] = [
  {
    key: 'product_id',
    label: 'Mã product_id',
    type: FormFieldType.SelectFetch,
    fetchOptions: async () => {
            try {
                const response = await ProductApi.getAll(1, 1000);
                const products = response.data?.products || [];
                const combinedOptions = [
                    ...products.map((product: Product) => ({
                        label: product.product_name,
                        value: product.product_id,
                    })),
                    
                ];
                return combinedOptions;
            } catch (error) {
                console.error('Error fetching products:', error);
                return [];
            }
        },
  }
  
];
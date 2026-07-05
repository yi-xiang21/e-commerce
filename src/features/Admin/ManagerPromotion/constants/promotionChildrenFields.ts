import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { productPromotion } from '../type/Promotion';

export const promotionChildrenFields: FormField<productPromotion>[] = [
  {
    key: 'product_id',
    label: 'Mã product_id',
    type: FormFieldType.Select,
  },
  
];
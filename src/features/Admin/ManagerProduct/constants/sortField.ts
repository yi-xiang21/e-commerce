import type { FormField } from "@/share/types/form-field";
import { FormModalMode, type FormModalModeType } from "@/share/types/type-form-mode";


export const getProductFieldsByMode = <T extends object>(
  fields: FormField<T>[],
  mode: FormModalModeType
): FormField<T>[] => {
  if (mode === FormModalMode.VIEW) 
    return fields; 
  
  const excludeKeys = ["product_id", "category_name", "type_name"];

  return fields.filter((field) => !excludeKeys.includes(String(field.key)));
};


export const getVariantFieldsByMode = <T extends object>(
  fields: FormField<T>[],
  mode: FormModalModeType
): FormField<T>[] => {
  if (mode === FormModalMode.VIEW) 
    return fields; 
  else
  {
    return fields.filter((field) => !["slug","variant_id","sku"].includes(String(field.key)));
  }
};
import type { FormField } from "@/share/types/form-field";
import { FormModalMode, type FormModalModeType } from "@/share/types/type-form-mode";


export const getStockFieldsByMode = <T extends object>(
  fields: FormField<T>[],
  mode: FormModalModeType
): FormField<T>[] => {
  if (mode === FormModalMode.VIEW) {
    return fields;
  }

  const excludeKeys = [
    "sku",
    "color",
    "size",
    "available_stock",
    "reserved_stock",
    "physical_stock",
    "product_name",
  ];


  return fields.filter((field) => !excludeKeys.includes(String(field.key)));
};


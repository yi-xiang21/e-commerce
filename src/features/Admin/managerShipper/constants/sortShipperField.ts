import type { FormField } from "@/share/types/form-field";
import { FormModalMode, type FormModalModeType } from "@/share/types/type-form-mode";


export const getShipperFieldsByMode = <T extends object>(
  fields: FormField<T>[],
  mode: FormModalModeType,
  actionType?: "location" | "status" | ""
): FormField<T>[] => {
  if (mode === FormModalMode.VIEW) 
    return fields; 
  
  if (mode === FormModalMode.CREATE) {
    return fields.filter(field => String(field.key) !== "status");
  }

  if (mode === FormModalMode.EDIT) {
    if (actionType === "location") {
      return fields.filter(field => String(field.key) === "working_city_id");
    }
    if (actionType === "status") {
      return fields.filter(field => String(field.key) === "status");
    }
  }

  return fields;
};


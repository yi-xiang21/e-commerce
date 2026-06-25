import type { FormField } from "@/share/types/form-field";
import { FormModalMode, type FormModalModeType } from "@/share/types/type-form-mode";

export const getOrderFieldsByMode = <T extends object>(
  fields: FormField<T>[],
  mode: FormModalModeType
): FormField<T>[] => {
  if (mode === FormModalMode.VIEW) {
    return fields;
  }

  return fields.filter((field) => field.key === "status");
};
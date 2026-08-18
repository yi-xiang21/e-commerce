import type { FormField } from "@/share/types/form-field";
import { FormModalMode, type FormModalModeType } from "@/share/types/type-form-mode";


export const getRewardsFieldsByMode = <T extends object>(
  fields: FormField<T>[],
  mode: FormModalModeType
): FormField<T>[] => {
  if (mode === FormModalMode.VIEW) 
    return fields; 
  
  if (mode === FormModalMode.CREATE) {
    const includeKeys = ["voucher_id", "required_points"];
    return fields.filter((field) => includeKeys.includes(String(field.key)));
  }

  if (mode === FormModalMode.EDIT) {
    const includeKeys = ["status"];
    return fields.filter((field) => includeKeys.includes(String(field.key)));
  }

  return fields;
};

import type { FormField } from "@/share/types/form-field";
import { FormModalMode, type FormModalModeType } from "@/share/types/type-form-mode";

export const getVoucherFieldsByMode = <T extends object>(
  fields: FormField<T>[],
  mode: FormModalModeType
): FormField<T>[] => {
  if (mode === FormModalMode.VIEW || mode === FormModalMode.EDIT) {
    return fields;
  }

  const filteredFields = fields.filter((field) => field.key !== "voucher_id");

  return filteredFields;
};
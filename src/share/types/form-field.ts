import type { FormFieldTypeKey } from "./type-form-field";
import type { ValidationRule } from "./validate-form";

export interface FormField<T> {
  key: keyof T;

  label: string;

  type: FormFieldTypeKey;

  placeholder?: string;

  options?: {
    label: string;
    value: string | number;
  }[];
  fetchOptions?: () => Promise<{ label: string; value: string | number }[]>;
  rules?: ValidationRule[];
  disabled?: boolean;
  mode?: 'multiple' | 'tags';
  
}
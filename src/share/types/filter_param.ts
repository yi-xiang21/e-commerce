import type { FormFieldTypeKey } from "./type-form-field";

export interface FilterField {
  key: string;
  label?: string;
  placeholder?: string;
  type: FormFieldTypeKey; 
  options?: { label: string; value: string | number }[];
  mode?: 'multiple' | 'tags'; 
  width?: string | number; 
  fetchOptions?: () => Promise<{ label: string; value: string | number }[]>;
}
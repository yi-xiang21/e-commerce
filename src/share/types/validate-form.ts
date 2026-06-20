export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  validator?: (
  value: any,
  formData?: any
) => boolean;
  message: string;          
}
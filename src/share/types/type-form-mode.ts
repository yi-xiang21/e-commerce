export const FormModalMode = {
  CREATE: 'create',
  VIEW: 'view',
  EDIT: 'edit',
} as const;

export type FormModalModeType = (typeof FormModalMode)[keyof typeof FormModalMode];

import validateForm from "@/share/ComponentCustom/validateForm";

export const validateChildren = (
  children: any[],
  childFields: any[],
  path: string = "children" // Đảm bảo khai báo kiểu string
) => {
  const errors: Record<string, string> = {};

  children.forEach((child, index) => {
    // 1. Validate mảng hiện tại
    const currentErrors = validateForm(child, childFields);

    Object.entries(currentErrors).forEach(([key, value]) => {
      errors[`${path}.${index}.${key}`] = value;
    });

    // 2. Gọi đệ quy nếu có mảng con lồng nhau
    if (child.children && Array.isArray(child.children) && child.children.length > 0) {
      Object.assign(
        errors,
        validateChildren(
          child.children,
          childFields,
          `${path}.${index}.children`
        )
      );
    }
  });

  return errors;
};
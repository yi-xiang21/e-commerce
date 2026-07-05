import type { Category } from "@/features/Admin/managerCatelogy/type/catelogy";

export const getParentCategories = (categories: Category[]) => {
  const parents: Category[] = [];

  const traverse = (nodes: Category[]) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        parents.push(node);
        traverse(node.children);
      }
    });
  };

  traverse(categories);

  return parents;
};

export const getLeafCategories = (categories: any[]) => {
  const result: { label: string; value: number }[] = [];

  const traverse = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (!node.children || node.children.length === 0) {
        result.push({
          label: node.category_name,
          value: node.id,
        });
      } else {
        traverse(node.children);
      }
    });
  };

  traverse(categories);

  return result;
};
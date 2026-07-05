export interface categoryChildren {
  id?: string | number;
  category_name: string;
  description: string;
  status?: "Active" | "Inactive";
  slug?: string;
  image_url?: string | null;
  children: categoryChildren[];
}

export interface Category {
  id?: string | number;
  category_name: string;
  description?: string;
  status?: "Active" | "Inactive";
  slug?: string;
  image_url?: string | null;
  children: categoryChildren[];
}

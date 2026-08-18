export interface Category {
    id: string ,
    category_name: string,
    description: string,
    image_url: string,
    slug: string,
    children: Category[],
}
export interface categoryChildren 
{
  id?: string | number,
  category_name: string,
  description: string,
  children: categoryChildren[],
}
export interface CategoryFormValues {
  id?: string | number;
  category_name: string;
  description?: string;
  slug?: string;
  image_url?: string | null;
  children: categoryChildren[];
}
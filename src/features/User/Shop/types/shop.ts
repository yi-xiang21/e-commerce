export interface ProductItem {
  product_id: number | string;
  product_name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number | string;
}

export interface CategoryItem {
  category_id: number | string;
  category_name: string;
}

export interface ShopState {
  products: ProductItem[];
  categories: CategoryItem[];
  isLoading: boolean;
  error: string | null;
  // Lưu luôn bộ lọc lên Store để trang nào cũng có thể đọc được nếu cần
  filters: {
    selectedCategory: string | number;
    minPrice: number;
    maxPrice: number;
    sortBy: string;
    currentPage: number;
    totalPages: number;
  };
}
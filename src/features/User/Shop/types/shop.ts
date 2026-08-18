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
  products: any[];
  categories: any[];
  isLoading: boolean;
  error: string | null;
  filters: {
    selectedCategory: string;
    minPrice: number;
    maxPrice: number;
    sortBy: string;
    currentPage: number;
    totalPages: number;
    totalItems?: number; //lưu tổng số sản phẩm trong database để biết có bao nhiêu trang
    limit?: number;      
  };
}
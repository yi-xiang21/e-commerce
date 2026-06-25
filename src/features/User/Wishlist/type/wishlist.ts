export interface WishlistItem {
  wishlist_id: number | string;
  product_id: number | string;
  product_name: string;
  min_price: string;
  image_url: string;
}

export interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}
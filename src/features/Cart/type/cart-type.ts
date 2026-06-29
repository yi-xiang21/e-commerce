export interface ICartItem {
    cart_id: number;
    variant_id: number;
    quantity: number;
    sku: string;
    slug: string;
    price: number | string;
    color: string;
    size: string;
    product_id: number;
    product_name: string;
    stock_quantity: number;
    image_url: string;
}

export interface ICartState {
    items: ICartItem[];
    isLoading: boolean;
    error: string | null;
}

export interface ISyncCartPayload {
    variant_id: number;
    quantity: number;
}
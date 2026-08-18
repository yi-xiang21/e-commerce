export interface ICartItem {
    cart_id: number;
    variant_id: number;
    quantity: number;
    sku: string;
    slug: string;
    price: number | string;
    discount?: {
        voucher_id?: number;
        voucher_name?: string;
        type?: string;
        value?: number | string;
    } | null;
    final_price?: number | string | null;
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
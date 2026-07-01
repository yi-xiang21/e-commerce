export interface productPromotion {
    product_id: number;
}
export interface promotion {
    promotion_id?: number;
    title: string;
    discount_type: string;
    value: number;
    min_order_value: number;
    start_date: string;
    end_date: string;
    status: string;
    applicable_products: productPromotion[];
}
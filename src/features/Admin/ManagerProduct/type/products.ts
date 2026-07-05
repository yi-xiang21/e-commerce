export interface image  {
    image_id?: number,
    image_url: string,
    sort_order: number
}
export interface voucher {
    type?: string,
    value?: number,
    voucher_id?: number,
    voucher_name?: string,
}
export interface Variant {
    variant_id?: number,
    sku: string,
    slug?: string,
    price: string,
    color: string,
    size: string,
    discount?:voucher,
    images: image[],
    final_price?: string,
    stock_quantity?: number
}
export interface Product {
    product_id?: number,
    type_id?: number,
    category_id?: number,
    product_name: string,
    description: string,
    product_status: string,
    category_name?: string,
    type_name?: string,
    variants: Variant[]
}
export interface voucher {
    voucher_id?: number;
    code: string;
    voucher_name: string;
    discount_type: string;
    value: number;
    minimum_value: number;
    max_discount?: number;
    quantity: number;
    used_count?: number;
    start_date: string;
    end_date: string;
}
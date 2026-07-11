export interface rewardsUser {
    reward_id?: number,
    required_points?: number,
    voucher_code?: string,
    voucher_name?: string,
    discount_type?: string,
    discount_value?: string,
} 

export interface redeemHistory {
    history_id?: number,
    points_changed?: number,
    transaction_type?: "redeem" | "earn" | "refund",
    reference_code?: string,
    description?: string,
    created_at: string,
}


export interface rewards {
   reward_id?: number,
   required_points?: number,
   status?: "active"|"inactive",
   created_at?: string,
   voucher_id?: number,
   voucher_code?: string,
   voucher_name?: string,
   discount_type?: "fixed"|"percent",
   discount_value?: string,
}

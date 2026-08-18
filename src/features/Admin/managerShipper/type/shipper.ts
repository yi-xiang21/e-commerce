
export interface shipper {
    shipper_id?: string,
    full_name?: string,
    phone?: string,
    email?:string
    status?: "active" | "inactive",
    created_at?: string,
    working_city_id?: string
}


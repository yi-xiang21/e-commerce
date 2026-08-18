
export interface status {
    active: "active",
    inactive: "inactive"
}

export interface role {
    customer: "customer"
    admin: "admin"
}
// Định nghĩa interface account để mô tả cấu trúc dữ liệu của một tài khoản
export interface account {
    user_id?: number,
    username: string,
    first_name: string,
    last_name: string,  
    password?: string,
    email: string,
    phone_number: string,
    status?: status,
    role: role,
}


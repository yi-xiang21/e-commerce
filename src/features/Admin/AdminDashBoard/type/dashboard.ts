export interface DashboardResponse {
    success: boolean;
    data: DashboardData;
}

export interface DashboardData {
    revenue: Revenue;
    revenue_chart: RevenueChart[];
    top_orders_today: TopOrder[];
    orders_count: OrdersCount;
    workshop_stats: WorkshopStats;
    users: Users;
    inventory_alerts: InventoryAlerts;
    top_selling_products: TopSellingProduct[];
}

export interface Revenue {
    today: number;
    this_week: number;
    this_month: number;
    growth_vs_last_week: number;
}

export interface RevenueChart {
    date: string;
    value: number;
}

export interface TopOrder {
    order_id: string;
    customer_name: string;
    total_amount: number;
}

export interface OrdersCount {
    pending: number;
    processing: number;
    shipping: number;
    completed: number;
    growth_vs_last_week: number;
}

export interface WorkshopStats {
    bookings_today: number;
    upcoming_count: number;
    growth_vs_last_week: number;
    top_workshops: TopWorkshop[];
}

export interface TopWorkshop {
    title: string;
    total_bookings: number;
}

export interface Users {
    active_customers: number;
    active_shippers: number;
    new_this_month: number;
}

export interface InventoryAlerts {
    out_of_stock: number;
    low_stock: number;
}

export interface TopSellingProduct {
    product_name: string;
    total_sold: number;
}

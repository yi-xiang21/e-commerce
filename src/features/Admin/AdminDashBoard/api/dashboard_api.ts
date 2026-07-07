import { API_CONFIG } from "@/config/api";
import {callAPI} from "@/share/lib/axios";
import type { DashboardResponse } from "@/features/Admin/AdminDashBoard/type/dashboard";
export const dashboardApi = {
    getDashBoard: async (): Promise<DashboardResponse> => {
        return callAPI.get(API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD);
    },
}
import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";

export const rewardUserApi = {
    getCanRedeemRewards: async (page: number, limit?: number) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_CAN_REDEEM, { params: { page, limit } });
    },
    getHistoryLoyalPoint: async (page: number, limit?: number) => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_HISTORY_LOYALTYPOINT, { params: { page, limit } });
    },
    redeemReward: async (rewardId: number) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.POST_REDEEM_VOUCHER, { reward_id: rewardId });
    },
    getMyVouchers: async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_MY_VOUCHERS)
    },
}
import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";


export const RewardsApi = {
    create : async (data:any) => {
        return callAPI.post(API_CONFIG.ENDPOINTS.POST_LOYALTY_REWARDS, data);
    },
    getRewards:async () => {
        return callAPI.get(API_CONFIG.ENDPOINTS.GET_LOYALTY_REWARDS);
    },
    updateReward:async (id:string,data:any) => {
        return callAPI.put(API_CONFIG.ENDPOINTS.PUT_UPDATE_REWARDS(id),data);
    }, 
    deleteReward:async (id:string) => {
        return callAPI.delete(API_CONFIG.ENDPOINTS.DELETE_LOYALTY_REWARDS(id));
    },  
}
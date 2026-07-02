import axios from "axios";
import { baseApiUrl } from "../../../../shared/util/baseApi";
import type { AnalyticsDto } from "../models/AnalyticsDto";

class AnalyticsService {

    async getAnalytics(): Promise<AnalyticsDto> {
        return (await axios.get(`${baseApiUrl}/api/analytics/get`)).data;
    }

}

const analyticsService = new AnalyticsService();
export default analyticsService;
import axios from "axios";
import { baseApiUrl } from "../../../../shared/util/baseApi";
import type { PageResponse } from "../../../../shared/models/PageResponse";
import type { WeeklyReviewDto } from "../current/models/WeeklyReviewDto";
import type { WeeklyReviewStatusDto } from "../current/models/WeeklyReviewStatusDto";

export type WeeklyReviewHistoryParams = {
    page?: number;
    size?: number;
};

class WeeklyReviewService {

    async currentReview(): Promise<WeeklyReviewStatusDto> {
        return (await axios.get(`${baseApiUrl}/api/weekly-review/current`)).data;
    }

    async generateReview(): Promise<WeeklyReviewDto> {
        return (await axios.post(`${baseApiUrl}/api/weekly-review/generate`)).data;
    }

    async reviewHistory(params: WeeklyReviewHistoryParams = {}): Promise<PageResponse<WeeklyReviewDto>> {
        return (await axios.get(`${baseApiUrl}/api/weekly-review/history`, { params })).data;
    }
}

const weeklyReviewService = new WeeklyReviewService();
export default weeklyReviewService;

import type { AiSummaryResponse } from "../../current/models/AiSummaryResponse";

export interface AiSummaryHistoryItem extends AiSummaryResponse {
    id: string;
    month: string;
    year: number;
    generatedAt: string;
}

import type { ReviewNoteDto } from "./ReviewNoteDto";
import type { ReviewTrend } from "./ReviewTrend";

export interface WeeklyReviewDto {
    id: string;
    /** Start of the analyzed week (inclusive), ISO instant. */
    weekStart: string;
    /** End of the analyzed week (exclusive), ISO instant. */
    weekEnd: string;
    summary: string;
    trend: ReviewTrend;
    notes: ReviewNoteDto[];
    totalApplications: number;
    activeDays: number;
    longestStreak: number;
    createdAt: string;
}

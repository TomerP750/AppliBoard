import type { WeeklyReviewDto } from "./WeeklyReviewDto";

export interface WeeklyReviewStatusDto {
    /** The review for the current window, or null if none was generated yet. */
    review: WeeklyReviewDto | null;
    canGenerate: boolean;
    /** The week a new review would analyze. */
    weekStart: string;
    weekEnd: string;
    /** When the next review window opens (Sunday 08:00). */
    nextAvailableAt: string;
}

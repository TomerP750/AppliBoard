// TEMPORARY sample data for building the UI. Replaced by the /api/weekly-review hooks in the next step.
import { ReviewNoteType } from "../models/ReviewNoteType";
import { ReviewTrend } from "../models/ReviewTrend";
import type { WeeklyReviewStatusDto } from "../models/WeeklyReviewStatusDto";

export const sampleWeeklyReviewStatus: WeeklyReviewStatusDto = {
    review: {
        id: "sample-review-2026-11-15",
        weekStart: "2026-11-15T00:00:00Z",
        weekEnd: "2026-11-22T00:00:00Z",
        summary:
            "You applied on four of seven days and sent more applications than the week before. Your best stretch was Monday to Wednesday, but the weekend and Thursday were quiet.",
        trend: ReviewTrend.UP,
        notes: [
            { type: ReviewNoteType.GOOD, content: "Three days in a row with at least one application, from Monday to Wednesday." },
            { type: ReviewNoteType.GOOD, content: "9 applications, up from 6 the week before." },
            { type: ReviewNoteType.NEUTRAL, content: "Most applications were sent at the start of the week." },
            { type: ReviewNoteType.IMPROVE, content: "Plan one or two applications for Thursday to keep the streak going." },
        ],
        totalApplications: 9,
        activeDays: 4,
        longestStreak: 3,
        createdAt: "2026-11-22T09:30:00Z",
    },
    canGenerate: false,
    weekStart: "2026-11-15T00:00:00Z",
    weekEnd: "2026-11-22T00:00:00Z",
    nextAvailableAt: "2026-11-29T08:00:00Z",
};

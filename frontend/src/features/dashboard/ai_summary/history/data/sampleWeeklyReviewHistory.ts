// TEMPORARY sample data for building the UI. Replaced by the /api/weekly-review/history hook in the next step.
import { ReviewNoteType } from "../../current/models/ReviewNoteType";
import { ReviewTrend } from "../../current/models/ReviewTrend";
import type { WeeklyReviewDto } from "../../current/models/WeeklyReviewDto";

export const sampleWeeklyReviewHistory: WeeklyReviewDto[] = [
    {
        id: "sample-review-2026-11-08",
        weekStart: "2026-11-08T00:00:00Z",
        weekEnd: "2026-11-15T00:00:00Z",
        summary:
            "You applied on three days, all in the first half of the week. The total was lower than the week before, and the second half of the week had no applications.",
        trend: ReviewTrend.DOWN,
        notes: [
            { type: ReviewNoteType.GOOD, content: "A solid start with applications on Sunday and Monday." },
            { type: ReviewNoteType.NEUTRAL, content: "All applications were sent before Wednesday." },
            { type: ReviewNoteType.IMPROVE, content: "Set a small goal of one application on Thursday and Friday." },
        ],
        totalApplications: 6,
        activeDays: 3,
        longestStreak: 2,
        createdAt: "2026-11-15T10:12:00Z",
    },
    {
        id: "sample-review-2026-11-01",
        weekStart: "2026-11-01T00:00:00Z",
        weekEnd: "2026-11-08T00:00:00Z",
        summary:
            "A steady week with five active days and the same total as the week before. Your rhythm was even, with one or two applications on most days.",
        trend: ReviewTrend.NEUTRAL,
        notes: [
            { type: ReviewNoteType.GOOD, content: "Five active days, your most consistent week so far." },
            { type: ReviewNoteType.GOOD, content: "A four-day streak from Monday to Thursday." },
            { type: ReviewNoteType.IMPROVE, content: "Try adding one more application on your busiest day." },
        ],
        totalApplications: 8,
        activeDays: 5,
        longestStreak: 4,
        createdAt: "2026-11-08T08:45:00Z",
    },
];

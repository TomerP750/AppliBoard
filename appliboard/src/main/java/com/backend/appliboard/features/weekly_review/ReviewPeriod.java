package com.backend.appliboard.features.weekly_review;

import java.time.Instant;

/**
 * The time ranges for the current review window.
 *
 * @param windowStart       when the current window opened (a Sunday 08:00)
 * @param nextWindowStart   when the next review becomes available
 * @param weekStart         start of the analyzed week (inclusive, the Sunday 00:00 before the window)
 * @param weekEnd           end of the analyzed week (exclusive)
 * @param previousWeekStart start of the week before the analyzed one, used for the trend
 */
public record ReviewPeriod(
        Instant windowStart,
        Instant nextWindowStart,
        Instant weekStart,
        Instant weekEnd,
        Instant previousWeekStart
) {
}

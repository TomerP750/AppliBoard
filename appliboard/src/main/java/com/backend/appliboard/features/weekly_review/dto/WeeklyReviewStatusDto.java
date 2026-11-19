package com.backend.appliboard.features.weekly_review.dto;

import java.time.Instant;

/**
 * The review for the current window, if one was generated, and when the next one is allowed.
 *
 * @param review          the current window's review, or {@code null} if none was generated yet
 * @param canGenerate     whether the user can generate a review now
 * @param weekStart       start of the week a new review would analyze
 * @param weekEnd         end (exclusive) of the week a new review would analyze
 * @param nextAvailableAt when the next review window opens
 */
public record WeeklyReviewStatusDto(
        WeeklyReviewDto review,
        boolean canGenerate,
        Instant weekStart,
        Instant weekEnd,
        Instant nextAvailableAt
) {
}

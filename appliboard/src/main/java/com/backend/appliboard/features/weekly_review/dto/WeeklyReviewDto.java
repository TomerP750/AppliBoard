package com.backend.appliboard.features.weekly_review.dto;

import com.backend.appliboard.features.weekly_review.ReviewTrend;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record WeeklyReviewDto(
        UUID id,
        Instant weekStart,
        Instant weekEnd,
        String summary,
        ReviewTrend trend,
        List<ReviewNoteDto> notes,
        long totalApplications,
        int activeDays,
        int longestStreak,
        Instant createdAt
) {
}

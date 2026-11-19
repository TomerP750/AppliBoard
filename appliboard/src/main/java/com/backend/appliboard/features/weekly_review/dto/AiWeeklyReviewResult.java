package com.backend.appliboard.features.weekly_review.dto;

import java.util.List;

/** The structured answer the AI returns for a weekly review. */
public record AiWeeklyReviewResult(
        String summary,
        List<ReviewNoteDto> notes
) {
}

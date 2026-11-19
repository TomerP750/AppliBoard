package com.backend.appliboard.features.weekly_review.dto;

import com.backend.appliboard.features.weekly_review.ReviewNoteType;

public record ReviewNoteDto(
        String content,
        ReviewNoteType type
) {
}

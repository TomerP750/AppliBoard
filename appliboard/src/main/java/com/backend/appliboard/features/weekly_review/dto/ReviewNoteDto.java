package com.backend.appliboard.features.weekly_review.dto;

import com.backend.appliboard.features.weekly_review.ReviewNoteType;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewNoteDto(
        @JsonProperty(required = true)
        @JsonPropertyDescription("One sentence, under 160 characters")
        @NotBlank
        @Size(max = 500) // matches the ReviewNote content column length
        String content,

        @JsonProperty(required = true)
        @JsonPropertyDescription("GOOD = something the user did well, NEUTRAL = a plain observation, "
                + "IMPROVE = one concrete, actionable suggestion for next week")
        @NotNull
        ReviewNoteType type
) {
}

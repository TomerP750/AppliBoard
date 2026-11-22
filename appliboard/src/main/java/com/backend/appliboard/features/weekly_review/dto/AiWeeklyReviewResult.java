package com.backend.appliboard.features.weekly_review.dto;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * The structured answer the AI returns for a weekly review.
 * The Jackson annotations describe the JSON schema sent to the AI; the validation
 * annotations are checked on the answer before it is saved.
 */
@JsonClassDescription("A short written review of how consistently the user applied to jobs during one week")
public record AiWeeklyReviewResult(
        @JsonProperty(required = true)
        @JsonPropertyDescription("2 to 3 sentences about the week's consistency, speaking to the user as \"you\"")
        @NotBlank
        @Size(max = 2000) // matches the WeeklyReview.summary column length
        String summary,

        @JsonProperty(required = true)
        @JsonPropertyDescription("3 to 5 short notes about the week; at least one must be of type IMPROVE")
        @NotEmpty
        @Size(max = 5)
        List<@Valid ReviewNoteDto> notes
) {
}

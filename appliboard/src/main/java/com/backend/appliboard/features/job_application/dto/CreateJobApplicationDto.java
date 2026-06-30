package com.backend.appliboard.features.job_application.dto;

import com.backend.appliboard.features.job_application.Position;
import com.backend.appliboard.features.job_application.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateJobApplicationDto(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 30, message = "Name must be between 2 and 30 characters")
        String name,

        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 20, message = "City must be between 2 and 20 characters")
        String city,

        @NotNull(message = "Status is required")
        Status status,

        @NotNull(message = "Position is required")
        Position position
) {
}

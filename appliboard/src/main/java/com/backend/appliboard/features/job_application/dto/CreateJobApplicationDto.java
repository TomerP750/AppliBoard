package com.backend.appliboard.features.job_application.dto;

import com.backend.appliboard.features.job_application.Position;
import com.backend.appliboard.features.job_application.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateJobApplicationDto(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String name,

        @NotNull(message = "Status is required")
        Status status,

        @NotNull(message = "Position is required")
        Position position
) {
}

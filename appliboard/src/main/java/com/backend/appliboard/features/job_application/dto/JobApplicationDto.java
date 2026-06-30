package com.backend.appliboard.features.job_application.dto;

import com.backend.appliboard.features.job_application.Position;
import com.backend.appliboard.features.job_application.Status;

import java.time.Instant;
import java.util.UUID;

public record JobApplicationDto(
        UUID id,
        String name,
        String city,
        Status status,
        Position position,
        Boolean isFavorite,
        Instant appliedAt
) {
}

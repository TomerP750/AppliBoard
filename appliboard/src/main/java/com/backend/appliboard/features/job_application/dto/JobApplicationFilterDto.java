package com.backend.appliboard.features.job_application.dto;

import com.backend.appliboard.features.job_application.Position;
import com.backend.appliboard.features.job_application.Status;

import java.util.List;

public record JobApplicationFilterDto(
        String name,
        List<Status> statuses,
        List<Position> positions,
        Boolean isFavorite
) {
}

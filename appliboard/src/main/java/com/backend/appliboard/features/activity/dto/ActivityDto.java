package com.backend.appliboard.features.activity.dto;

import com.backend.appliboard.features.activity.ActivityType;

import java.time.Instant;
import java.util.UUID;

public record ActivityDto(
        UUID id,
        String message,
        ActivityType activityType,
        Instant createdAt
) {
}

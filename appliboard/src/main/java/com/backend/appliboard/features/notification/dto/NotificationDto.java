package com.backend.appliboard.features.notification.dto;

import com.backend.appliboard.features.notification.NotificationType;

import java.time.Instant;
import java.util.UUID;

public record NotificationDto(
        UUID id,
        String message,
        String jobApplicationName,
        Boolean isRead,
        NotificationType notificationType,
        Instant createdAt
        ) {
}

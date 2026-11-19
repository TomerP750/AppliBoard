package com.backend.appliboard.features.notification.event;

import java.time.Instant;
import java.util.UUID;

/**
 * Published to Kafka when a job application has not been updated for too long.
 * Consumed to create a STALE_APPLICATION notification for the user.
 */
public record StaleApplicationEvent(
        UUID userId,
        UUID jobApplicationId,
        String jobApplicationName,
        Instant lastUpdatedAt
) {
}

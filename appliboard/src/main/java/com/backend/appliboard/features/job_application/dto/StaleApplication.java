package com.backend.appliboard.features.job_application.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * A job application that hasn't been updated for too long and still needs a reminder.
 * Built directly by {@code JobApplicationRepository.findStaleWithoutNotification}.
 */
public record StaleApplication(
        UUID userId,
        UUID jobApplicationId,
        String jobApplicationName,
        Instant lastUpdatedAt
) {
}

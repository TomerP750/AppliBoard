package com.backend.appliboard.features.job_application;

import java.util.UUID;

/**
 * Published when a user's job applications change in a way that affects aggregated figures
 * (an application is created or deleted, or its status changes). Features that cache data derived
 * from the applications (for example analytics) listen for it, so this feature doesn't need to know about them.
 * Listen with {@code @TransactionalEventListener} so the cleanup runs only after the change commits.
 */
public record JobApplicationsChangedEvent(UUID userId) {
}

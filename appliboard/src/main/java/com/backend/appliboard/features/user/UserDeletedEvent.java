package com.backend.appliboard.features.user;

import java.util.UUID;

/**
 * Published when a user account is deleted. Features that keep data for the user outside the database
 * (for example Redis caches) listen for it and clean up, so the user feature doesn't need to know about them.
 * Listen with {@code @TransactionalEventListener} so the cleanup runs only after the deletion commits.
 */
public record UserDeletedEvent(UUID userId) {
}

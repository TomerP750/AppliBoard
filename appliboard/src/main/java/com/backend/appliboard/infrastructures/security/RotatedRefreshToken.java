package com.backend.appliboard.infrastructures.security;

import java.util.UUID;

/**
 * Result of a successful refresh: the session's owner and the new refresh token that replaces the presented one.
 */
public record RotatedRefreshToken(UUID userId, String token) {
}

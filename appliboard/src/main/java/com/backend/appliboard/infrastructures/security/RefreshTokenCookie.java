package com.backend.appliboard.infrastructures.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Builds the HttpOnly cookie that carries the refresh token.
 * It is only sent to {@code /api/auth}, never readable by JavaScript, and {@code SameSite=Strict},
 * so other sites can't make the browser send it.
 */
@Component
public class RefreshTokenCookie {

    public static final String NAME = "refresh_token";
    private static final String PATH = "/api/auth";

    private final Duration refreshTokenTtl;
    private final boolean isSecure;

    public RefreshTokenCookie(@Value("${jwt.refresh-expiration-ms}") long refreshTokenExpirationMs,
                              @Value("${auth.cookie.secure}") boolean isSecure) {
        this.refreshTokenTtl = Duration.ofMillis(refreshTokenExpirationMs);
        this.isSecure = isSecure;
    }

    /** A cookie holding the refresh token, expiring together with its Redis session. */
    public ResponseCookie buildRefreshTokenCookie(String refreshToken) {
        return baseRefreshTokenCookie(refreshToken).maxAge(refreshTokenTtl).build();
    }

    /** A cookie that makes the browser delete the refresh token. */
    public ResponseCookie buildExpiredRefreshTokenCookie() {
        return baseRefreshTokenCookie("").maxAge(Duration.ZERO).build();
    }

    private ResponseCookie.ResponseCookieBuilder baseRefreshTokenCookie(String value) {
        return ResponseCookie.from(NAME, value)
                .httpOnly(true)
                .secure(isSecure)
                .sameSite("Strict")
                .path(PATH);
    }
}

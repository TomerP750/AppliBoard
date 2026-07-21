package com.backend.appliboard.features.authentication.refresh_token;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@Slf4j
@RequiredArgsConstructor
public class RefreshTokenCookieService {

    private static final String COOKIE_NAME = "refreshToken";

    @Value("${jwt.refresh-expiration-ms}")
    private long expirationMs;

    public ResponseCookie create(String refreshToken) {
        return ResponseCookie.from(COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(Duration.ofMillis(expirationMs))
                .build();
    }

    public ResponseCookie clear() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(Duration.ZERO)
                .build();
    }
}

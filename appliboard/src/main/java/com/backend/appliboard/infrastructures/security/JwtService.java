package com.backend.appliboard.infrastructures.security;

import com.backend.appliboard.features.user.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private long expirationMs = 1000 * 60 * 60;

    private SecretKey getSignInKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UUID userId, String email, Role role) {
        Date now = new Date(System.currentTimeMillis());
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .issuer("AppliBoard")
                .issuedAt(now)
                .expiration(expiration)
                .subject(email)
                .claim("userId", userId)
                .claim("role", role.name())
                .signWith(getSignInKey())
                .compact();
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException e) {
            log.error(e.getMessage());
            throw new JwtException(e.getMessage());
        }
    }

    public UUID extractUserId(String token) {
        try {
            return UUID.fromString(getClaims(token).get("userId", String.class));
        } catch (JwtException | IllegalArgumentException e) {
            throw new JwtException("Failed to extract user id");
        }
    }

    public boolean isValidToken(String token) {

        Date expiration = getClaims(token).getExpiration();
        Date now = new Date(System.currentTimeMillis());

        return !expiration.before(now);
    }

}

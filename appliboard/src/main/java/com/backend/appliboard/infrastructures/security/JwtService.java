package com.backend.appliboard.infrastructures.security;

import com.backend.appliboard.features.user.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

/**
 * Issues and verifies the short-lived JWT access tokens. Refresh tokens are not JWTs: see {@link RefreshTokenStore}.
 */
@Service
public class JwtService {

    private static final String ISSUER = "AppliBoard";
    private static final String USER_ID_CLAIM = "userId";
    private static final String ROLE_CLAIM = "role";
    private static final String TOKEN_TYPE_CLAIM = "type";
    /**
     * Marks a JWT as an access token, so any other JWT signed with the same secret later
     * (for example a password-reset link) can't be used to sign in.
     */
    private static final String ACCESS_TOKEN_TYPE = "ACCESS";

    private final SecretKey signingKey;
    private final JwtParser accessTokenParser;
    private final long accessTokenExpirationMs;

    /**
     * Builds the key and parser once. A secret shorter than 32 bytes throws {@code WeakKeyException} here,
     * so a misconfigured secret stops the application from starting instead of failing every request.
     */
    public JwtService(@Value("${jwt.secret}") String jwtSecret,
                      @Value("${jwt.access-expiration-ms}") long accessTokenExpirationMs) {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenParser = Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(ISSUER)
                .build();
        this.accessTokenExpirationMs = accessTokenExpirationMs;
    }

    public String generateAccessToken(UUID userId, String email, Role role) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + accessTokenExpirationMs);

        return Jwts.builder()
                .issuer(ISSUER)
                .issuedAt(now)
                .expiration(expiration)
                .subject(email)
                .claim(USER_ID_CLAIM, userId.toString())
                .claim(ROLE_CLAIM, role.name())
                .claim(TOKEN_TYPE_CLAIM, ACCESS_TOKEN_TYPE)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Verifies the access token (signature, expiry, issuer and type) and returns the user id it was issued for.
     *
     * @throws JwtException when the token is malformed, badly signed, expired, from another issuer,
     *                      not an access token, or has no valid user id
     */
    public UUID extractUserIdFromAccessToken(String token) {
        Claims claims = accessTokenParser.parseSignedClaims(token).getPayload();
        requireAccessTokenType(claims);
        return readUserId(claims);
    }

    private static void requireAccessTokenType(Claims claims) {
        String tokenType = claims.get(TOKEN_TYPE_CLAIM, String.class);
        if (!ACCESS_TOKEN_TYPE.equals(tokenType)) {
            throw new JwtException("Not an access token");
        }
    }

    private static UUID readUserId(Claims claims) {
        String userId = claims.get(USER_ID_CLAIM, String.class);
        if (userId == null) {
            throw new JwtException("Access token has no user id");
        }
        try {
            return UUID.fromString(userId);
        } catch (IllegalArgumentException e) {
            throw new JwtException("Access token has an invalid user id", e);
        }
    }

}

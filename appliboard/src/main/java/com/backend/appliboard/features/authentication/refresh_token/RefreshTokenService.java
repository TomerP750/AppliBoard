package com.backend.appliboard.features.authentication.refresh_token;

import com.backend.appliboard.shared.exceptions.InvalidRefreshTokenException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RefreshTokenService implements IRefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final MongoTemplate mongoTemplate;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshTokenExpirationMs;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Base64.Encoder BASE64 =
            Base64.getUrlEncoder().withoutPadding();


    public String issue(UUID userId) {
        String rawToken = generateRefreshToken();
        RefreshToken document = RefreshToken.builder()
                .tokenHash(hash(rawToken))
                .userId(userId.toString())
                .createdAt(Instant.now())
                .expiresAt(
                        Instant.now().plusMillis(refreshTokenExpirationMs)
                )
                .revoked(false)
                .build();
        refreshTokenRepository.save(document);
        return rawToken;
    }

    @Override
    public RefreshToken validate(String rawToken) throws InvalidRefreshTokenException {

        if (rawToken == null || rawToken.isBlank()) {
            throw new InvalidRefreshTokenException("Refresh token is missing");
        }

        RefreshToken token = refreshTokenRepository
                .findById(hash(rawToken))
                .orElseThrow(() ->
                        new InvalidRefreshTokenException("Invalid refresh token"));

        if (Boolean.TRUE.equals(token.getRevoked())) {
            throw new InvalidRefreshTokenException("Refresh token was revoked");
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidRefreshTokenException("Refresh token expired");
        }

        return token;
    }

    @Override
    public String rotate(String rawToken) throws InvalidRefreshTokenException {
        if (rawToken == null || rawToken.isBlank()) {
            throw new InvalidRefreshTokenException("Refresh token is missing");
        }

        Query query = Query.query(
                Criteria.where("_id").is(hash(rawToken))
                        .and("revoked").is(false)
                        .and("expiresAt").gt(Instant.now())
        );

        Update update = new Update().set("revoked", true);

        RefreshToken oldToken = mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(false),
                RefreshToken.class
        );

        if (oldToken == null) {
            throw new InvalidRefreshTokenException(
                    "Refresh token is invalid, expired, or already used"
            );
        }

        return issue(UUID.fromString(oldToken.getUserId()));
    }

    @Override
    public void revoke(String rawToken) throws InvalidRefreshTokenException {

        if (rawToken == null || rawToken.isBlank()) {
            throw new InvalidRefreshTokenException("Token not found");
        }

        Query query = Query.query(
                Criteria.where("_id").is(hash(rawToken))
        );

        mongoTemplate.updateFirst(
                query,
                new Update().set("revoked", true),
                RefreshToken.class
        );
    }

    private String generateRefreshToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return BASE64.encodeToString(bytes);
    }

    private String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(
                    rawToken.getBytes(StandardCharsets.UTF_8)
            );
            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is unavailable",
                    exception
            );
        }
    }
}

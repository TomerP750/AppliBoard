package com.backend.appliboard.infrastructures.security;

import com.backend.appliboard.features.user.UserDeletedEvent;
import com.backend.appliboard.shared.exceptions.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Refresh tokens kept in Redis, one login session ("family") per key.
 * <p>
 * A token is {@code <familyId>.<secret>}. Redis stores {@code appliboard::refresh::<familyId>} with the value
 * {@code <userId>:<sha256(secret)>}, so a Redis dump can't be replayed. Every refresh swaps the secret for a new
 * one. Presenting an older secret of the same family means the token leaked, so the whole family is deleted.
 * <p>
 * A session lives for at most {@code jwt.refresh-expiration-ms} after login: rotation keeps the original TTL.
 * {@code appliboard::user-sessions::<userId>} lists the user's family ids so all of them can be revoked at once.
 * Ids of families that already expired may linger in that set until it expires itself; deleting them is a no-op.
 * <p>
 * Unlike the analytics cache there is no database to fall back to, so Redis errors propagate (fail closed),
 * except in the account-deletion listener, which runs after the deletion has committed.
 */
@Slf4j
@Component
public class RefreshTokenStore {

    private static final String FAMILY_KEY_PREFIX = "appliboard::refresh::";
    private static final String USER_SESSIONS_KEY_PREFIX = "appliboard::user-sessions::";
    private static final String TOKEN_SEPARATOR = ".";
    /** Must match the ':' the rotate script splits on. */
    private static final String SESSION_SEPARATOR = ":";
    private static final int SECRET_BYTES = 32;

    private static final String MISSING = "MISSING";
    private static final String REUSED = "REUSED";

    /** KEYS: family, user sessions. ARGV: session value, ttl ms, family id. */
    private static final RedisScript<Long> CREATE_SCRIPT = RedisScript.of("""
            redis.call('SET', KEYS[1], ARGV[1], 'PX', ARGV[2])
            redis.call('SADD', KEYS[2], ARGV[3])
            redis.call('PEXPIRE', KEYS[2], ARGV[2])
            return 1
            """, Long.class);

    /** KEYS: family. ARGV: presented secret hash, new secret hash. Returns the user id, MISSING or REUSED. */
    private static final RedisScript<String> ROTATE_SCRIPT = RedisScript.of("""
            local session = redis.call('GET', KEYS[1])
            if not session then
                return 'MISSING'
            end
            local userId, tokenHash = string.match(session, '^([^:]+):(.+)$')
            if tokenHash ~= ARGV[1] then
                redis.call('DEL', KEYS[1])
                return 'REUSED'
            end
            redis.call('SET', KEYS[1], userId .. ':' .. ARGV[2], 'KEEPTTL')
            return userId
            """, String.class);

    private final StringRedisTemplate redisTemplate;
    private final Duration refreshTokenTtl;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenStore(StringRedisTemplate redisTemplate,
                             @Value("${jwt.refresh-expiration-ms}") long refreshTokenExpirationMs) {
        this.redisTemplate = redisTemplate;
        this.refreshTokenTtl = Duration.ofMillis(refreshTokenExpirationMs);
    }

    /**
     * Starts a new session for the user and returns its first refresh token.
     */
    public String createRefreshToken(UUID userId) {
        String familyId = UUID.randomUUID().toString();
        String secret = generateRandomSecret();

        String storedSession = userId + SESSION_SEPARATOR + hashSecret(secret);
        redisTemplate.execute(CREATE_SCRIPT,
                List.of(refreshTokenFamilyKey(familyId), userSessionsKey(userId)),
                storedSession, String.valueOf(refreshTokenTtl.toMillis()), familyId);

        return formatRefreshToken(familyId, secret);
    }

    /**
     * Swaps the presented refresh token for a new one in the same session.
     *
     * @throws UnauthorizedException when the token is malformed, expired, revoked or was already used
     */
    public RotatedRefreshToken rotateRefreshToken(String refreshToken) throws UnauthorizedException {
        ParsedRefreshToken presentedToken = parseRefreshToken(refreshToken);
        String newSecret = generateRandomSecret();

        String rotationResult = redisTemplate.execute(ROTATE_SCRIPT,
                List.of(refreshTokenFamilyKey(presentedToken.familyId())),
                hashSecret(presentedToken.secret()), hashSecret(newSecret));

        if (rotationResult == null || MISSING.equals(rotationResult)) {
            throw new UnauthorizedException("Refresh token expired or revoked");
        }
        if (REUSED.equals(rotationResult)) {
            log.warn("Refresh token reuse detected, session {} revoked", presentedToken.familyId());
            throw new UnauthorizedException("Refresh token expired or revoked");
        }

        UUID userId = UUID.fromString(rotationResult);
        return new RotatedRefreshToken(userId, formatRefreshToken(presentedToken.familyId(), newSecret));
    }

    /**
     * Ends the session the token belongs to. Unknown or malformed tokens are ignored, so logout always succeeds.
     */
    public void revokeRefreshToken(String refreshToken) {
        String familyId = parseFamilyIdOrNull(refreshToken);
        if (familyId == null) {
            return;
        }

        String storedSession = redisTemplate.opsForValue().getAndDelete(refreshTokenFamilyKey(familyId));
        if (storedSession != null) {
            redisTemplate.opsForSet().remove(userSessionsKey(extractUserId(storedSession)), familyId);
        }
    }

    /**
     * Ends every session of the user, for example after a password change.
     */
    public void revokeAllRefreshTokens(UUID userId) {
        String userSessionsKey = userSessionsKey(userId);
        Set<String> familyIds = redisTemplate.opsForSet().members(userSessionsKey);

        List<String> keysToDelete = new ArrayList<>();
        keysToDelete.add(userSessionsKey);
        if (familyIds != null) {
            familyIds.forEach(familyId -> keysToDelete.add(refreshTokenFamilyKey(familyId)));
        }

        redisTemplate.delete(keysToDelete);
    }

    /**
     * Ends the deleted user's sessions once the deletion has committed.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onUserDeleted(UserDeletedEvent event) {
        try {
            revokeAllRefreshTokens(event.userId());
        } catch (DataAccessException e) {
            // The account is already gone, so refresh fails anyway when it can't load the user.
            log.warn("Could not revoke refresh tokens of deleted user {}", event.userId(), e);
        }
    }

    private ParsedRefreshToken parseRefreshToken(String refreshToken) throws UnauthorizedException {
        String familyId = parseFamilyIdOrNull(refreshToken);
        if (familyId == null) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        return new ParsedRefreshToken(familyId, refreshToken.substring(familyId.length() + TOKEN_SEPARATOR.length()));
    }

    /**
     * Returns the family id of a well-formed token ({@code <uuid>.<non-empty secret>}), otherwise {@code null}.
     */
    private static String parseFamilyIdOrNull(String refreshToken) {
        if (refreshToken == null) {
            return null;
        }
        int separatorIndex = refreshToken.indexOf(TOKEN_SEPARATOR);
        if (separatorIndex <= 0 || separatorIndex == refreshToken.length() - 1) {
            return null;
        }

        String familyId = refreshToken.substring(0, separatorIndex);
        try {
            return UUID.fromString(familyId).toString().equals(familyId) ? familyId : null;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private String generateRandomSecret() {
        byte[] secretBytes = new byte[SECRET_BYTES];
        secureRandom.nextBytes(secretBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(secretBytes);
    }

    private static String hashSecret(String secret) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(secret.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }

    private static String formatRefreshToken(String familyId, String secret) {
        return familyId + TOKEN_SEPARATOR + secret;
    }

    private static UUID extractUserId(String storedSession) {
        return UUID.fromString(storedSession.substring(0, storedSession.indexOf(SESSION_SEPARATOR)));
    }

    private static String refreshTokenFamilyKey(String familyId) {
        return FAMILY_KEY_PREFIX + familyId;
    }

    private static String userSessionsKey(UUID userId) {
        return USER_SESSIONS_KEY_PREFIX + userId;
    }

    private record ParsedRefreshToken(String familyId, String secret) {
    }
}

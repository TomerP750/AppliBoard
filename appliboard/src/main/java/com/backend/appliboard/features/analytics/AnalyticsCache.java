package com.backend.appliboard.features.analytics;

import com.backend.appliboard.features.analytics.dto.AnalyticsDto;
import com.backend.appliboard.features.job_application.JobApplicationsChangedEvent;
import com.backend.appliboard.features.user.UserDeletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.json.JsonMapper;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Cache-aside for a user's analytics in Redis: one string key per user, {@code appliboard::analytics::<userId>},
 * holding the whole {@link AnalyticsDto} as JSON.
 * The weekly and monthly figures depend on the current period, so an entry never outlives the period it was
 * computed in. Writes that change the figures clear the entry through {@link JobApplicationsChangedEvent}.
 * If Redis is unavailable, reads fall back to the database and errors are only logged.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AnalyticsCache {

    private static final String KEY_PREFIX = "appliboard::analytics::";
    private static final Duration MAX_TTL = Duration.ofMinutes(10);
    private static final Duration MIN_TTL = Duration.ofSeconds(1);

    private final StringRedisTemplate redisTemplate;
    private final JsonMapper jsonMapper;

    /**
     * Returns the cached analytics on a hit. On a miss, loads them with {@code loader} (the database) and caches
     * them until {@code expiresNoLaterThan} (the start of the next week or month) or for {@link #MAX_TTL},
     * whichever comes first.
     */
    public AnalyticsDto getOrLoad(UUID userId, Instant expiresNoLaterThan, Supplier<AnalyticsDto> loader) {
        String userKey = userKey(userId);

        AnalyticsDto cachedAnalytics = readAnalytics(userKey);
        if (cachedAnalytics != null) {
            return cachedAnalytics;
        }

        AnalyticsDto analytics = loader.get();
        writeAnalytics(userKey, analytics, ttlUntil(expiresNoLaterThan));
        return analytics;
    }

    /**
     * Clears the user's analytics once the change has committed. {@code fallbackExecution} also clears them
     * when the event is published outside a transaction.
     * <p>
     * Known limit (cache-aside race): a read that loaded from MySQL before the commit and stores its result
     * after this delete puts the old figures back. They stay stale for at most {@link #MAX_TTL}.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onJobApplicationsChanged(JobApplicationsChangedEvent event) {
        deleteAnalytics(event.userId());
    }

    /**
     * Clears the deleted user's analytics once the account deletion has committed.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onUserDeleted(UserDeletedEvent event) {
        deleteAnalytics(event.userId());
    }

    private AnalyticsDto readAnalytics(String userKey) {
        try {
            String analyticsJson = redisTemplate.opsForValue().get(userKey);
            return analyticsJson == null ? null : jsonMapper.readValue(analyticsJson, AnalyticsDto.class);
        } catch (DataAccessException | JacksonException e) {
            log.warn("Could not read cached analytics from {}", userKey, e);
            return null;
        }
    }

    /**
     * SET with an expiry is a single Redis command, so the key can never exist without a TTL.
     */
    private void writeAnalytics(String userKey, AnalyticsDto analytics, Duration ttl) {
        if (ttl.compareTo(MIN_TTL) < 0) {
            return;
        }

        try {
            redisTemplate.opsForValue().set(userKey, jsonMapper.writeValueAsString(analytics), ttl);
        } catch (DataAccessException | JacksonException e) {
            log.warn("Could not cache analytics in {}", userKey, e);
        }
    }

    private void deleteAnalytics(UUID userId) {
        try {
            redisTemplate.delete(userKey(userId));
        } catch (DataAccessException e) {
            // The DB write already succeeded; stale analytics expire with the TTL.
            log.warn("Could not evict cached analytics for user {}", userId, e);
        }
    }

    private static Duration ttlUntil(Instant expiresNoLaterThan) {
        Duration untilPeriodEnds = Duration.between(Instant.now(), expiresNoLaterThan);
        return untilPeriodEnds.compareTo(MAX_TTL) < 0 ? untilPeriodEnds : MAX_TTL;
    }

    private static String userKey(UUID userId) {
        return KEY_PREFIX + userId;
    }
}

package com.backend.appliboard.features.job_application;

import com.backend.appliboard.features.job_application.dto.JobApplicationDto;
import com.backend.appliboard.features.job_application.dto.JobApplicationFilterDto;
import com.backend.appliboard.features.user.UserDeletedEvent;
import com.backend.appliboard.shared.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Cache-aside for job application pages in Redis.
 * Each user has one Redis hash, {@code appliboard::jobApplications::<userId>}, with one field per
 * filters + page combination. Clearing a user's cache is a single DEL of that key.
 * If Redis is unavailable, reads fall back to the database and errors are only logged.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JobApplicationPageCache {

    private static final String KEY_PREFIX = "appliboard::jobApplications::";
    private static final Duration TTL = Duration.ofMinutes(5);
    private static final TypeReference<PageResponse<JobApplicationDto>> PAGE_TYPE = new TypeReference<>() {
    };

    /**
     * Stores one page (HSET) and sets the TTL in the same step. Redis runs a script as one command, so either
     * both happen or neither does. {@code NX} sets the TTL only when the hash has none yet (Redis 7+), so every
     * cached page of the user is gone at most {@link #TTL} after the first one was stored.
     * KEYS[1] = user hash, ARGV[1] = page field, ARGV[2] = page JSON, ARGV[3] = TTL in seconds.
     */
    private static final RedisScript<Long> STORE_PAGE_WITH_TTL = RedisScript.of("""
            redis.call('HSET', KEYS[1], ARGV[1], ARGV[2])
            redis.call('EXPIRE', KEYS[1], ARGV[3], 'NX')
            return 1
            """, Long.class);

    private final StringRedisTemplate redisTemplate;
    private final JsonMapper jsonMapper;

    /**
     * Returns the cached page on a hit. On a miss, loads it with {@code loader} (the database) and caches it.
     */
    public PageResponse<JobApplicationDto> getOrLoad(UUID userId, JobApplicationFilterDto filters, Pageable pageable,
                                                     Supplier<PageResponse<JobApplicationDto>> loader) {
        String userKey = userKey(userId);
        String pageField = pageField(filters, pageable);

        PageResponse<JobApplicationDto> cachedPage = readPage(userKey, pageField);
        if (cachedPage != null) {
            return cachedPage;
        }

        PageResponse<JobApplicationDto> page = loader.get();
        writePage(userKey, pageField, page);
        return page;
    }

    /**
     * Deletes all of the user's cached pages. Inside a transaction this runs after the commit, so a
     * rolled-back write keeps the cache, and reads that start after the commit always load fresh data.
     * <p>
     * Known limit (cache-aside race): a read that loaded from MySQL before the commit and stores its page
     * after this delete puts the old page back. That page stays stale for at most the TTL (5 minutes).
     */
    public void evictUser(UUID userId) {
        runAfterCommit(() -> deleteUserPages(userId));
    }

    /**
     * Clears the deleted user's cached pages once the account deletion has committed.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onUserDeleted(UserDeletedEvent event) {
        deleteUserPages(event.userId());
    }

    private PageResponse<JobApplicationDto> readPage(String userKey, String pageField) {
        try {
            String pageJson = hashOperations().get(userKey, pageField);
            return pageJson == null ? null : jsonMapper.readValue(pageJson, PAGE_TYPE);
        } catch (DataAccessException | JacksonException e) {
            log.warn("Could not read cached job application page from {}", userKey, e);
            return null;
        }
    }

    /**
     * Stores the page and sets the TTL in one atomic script, so the user's hash can never exist without a TTL.
     */
    private void writePage(String userKey, String pageField, PageResponse<JobApplicationDto> page) {
        try {
            String pageJson = jsonMapper.writeValueAsString(page);
            redisTemplate.execute(STORE_PAGE_WITH_TTL, List.of(userKey), pageField, pageJson, String.valueOf(TTL.toSeconds()));
        } catch (DataAccessException | JacksonException e) {
            log.warn("Could not cache job application page in {}", userKey, e);
        }
    }

    private void deleteUserPages(UUID userId) {
        try {
            redisTemplate.delete(userKey(userId));
        } catch (DataAccessException e) {
            // The DB write already succeeded; stale pages expire with the TTL.
            log.warn("Could not evict cached job application pages for user {}", userId, e);
        }
    }

    private HashOperations<String, String, String> hashOperations() {
        return redisTemplate.opsForHash();
    }

    private static String userKey(UUID userId) {
        return KEY_PREFIX + userId;
    }

    private static String pageField(JobApplicationFilterDto filters, Pageable pageable) {
        return filters + "|" + pageable;
    }

    private static void runAfterCommit(Runnable action) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            action.run();
            return;
        }

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                action.run();
            }
        });
    }
}

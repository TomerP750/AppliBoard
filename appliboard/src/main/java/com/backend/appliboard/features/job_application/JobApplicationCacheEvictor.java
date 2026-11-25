package com.backend.appliboard.features.job_application;

import com.backend.appliboard.infrastructures.config.CacheNames;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.transaction.TransactionAwareCacheDecorator;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.cache.RedisCache;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.UUID;

/**
 * Removes one user's cached job application pages, leaving other users' entries in place.
 * {@code @CacheEvict} can only remove one exact key or a whole cache, and a user's pages are many keys
 * (one per filter, sort and page), so they're removed with a pattern delete (SCAN, see {@code RedisConfig}).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JobApplicationCacheEvictor {

    private final CacheManager cacheManager;

    /**
     * Deletes every cached page of the user (all filters, sorts and pages).
     * Inside a transaction this runs after the commit, so a rolled-back write keeps the cache, and a read
     * that runs before the commit can't put old data back into the cache after it's cleared.
     */
    public void evictUserApplicationPages(UUID userId) {
        runAfterCommit(() -> deleteUserApplicationPages(userId));
    }

    private void deleteUserApplicationPages(UUID userId) {
        try {
            // RedisCache adds the cache's key prefix itself: appliboard::jobApplications::<userId>:*
            jobApplicationsRedisCache().clear(userId + ":*");
        } catch (DataAccessException e) {
            // The DB write already succeeded; stale pages expire with the cache TTL.
            log.warn("Could not evict cached job application pages for user {}", userId, e);
        }
    }

    /**
     * The cache manager is transaction-aware, so it hands out caches wrapped in a decorator.
     * Pattern clearing only exists on the underlying {@link RedisCache}.
     */
    private RedisCache jobApplicationsRedisCache() {
        Cache cache = cacheManager.getCache(CacheNames.JOB_APPLICATIONS);
        if (cache instanceof TransactionAwareCacheDecorator decorator) {
            cache = decorator.getTargetCache();
        }

        return (RedisCache) cache;
    }

    private void runAfterCommit(Runnable action) {
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

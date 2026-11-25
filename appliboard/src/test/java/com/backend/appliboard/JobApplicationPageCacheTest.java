package com.backend.appliboard;

import com.backend.appliboard.features.job_application.JobApplicationPageCache;
import com.backend.appliboard.features.job_application.Position;
import com.backend.appliboard.features.job_application.Status;
import com.backend.appliboard.features.job_application.dto.JobApplicationDto;
import com.backend.appliboard.features.user.UserDeletedEvent;
import com.backend.appliboard.shared.dto.PageResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import tools.jackson.databind.json.JsonMapper;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JobApplicationPageCacheTest {

    private static final UUID USER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final String USER_KEY = "appliboard::jobApplications::" + USER_ID;
    private static final Duration TTL = Duration.ofMinutes(5);

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private HashOperations<String, String, String> hashOperations;

    private final JsonMapper jsonMapper = JsonMapper.builder().build();
    private final Pageable pageable = PageRequest.of(0, 10);
    private final PageResponse<JobApplicationDto> page = pageOfOneApplication();

    private JobApplicationPageCache pageCache;

    @BeforeEach
    public void setUp() {
        pageCache = new JobApplicationPageCache(redisTemplate, jsonMapper);
    }

    @AfterEach
    public void clearTransactionSynchronization() {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.clearSynchronization();
        }
    }

    @Test
    public void getOrLoad_ShouldReturnCachedPageWithoutLoading_WhenPageIsCached() {
        when(redisTemplate.<String, String>opsForHash()).thenReturn(hashOperations);
        when(hashOperations.get(eq(USER_KEY), anyString())).thenReturn(jsonMapper.writeValueAsString(page));

        PageResponse<JobApplicationDto> result = pageCache.getOrLoad(USER_ID, null, pageable,
                () -> fail("The database should not be queried on a cache hit"));

        assertEquals(page, result);
    }

    @Test
    public void getOrLoad_ShouldLoadAndStorePageWithTtlInOneScript_WhenPageIsNotCached() {
        when(redisTemplate.<String, String>opsForHash()).thenReturn(hashOperations);
        when(hashOperations.get(eq(USER_KEY), anyString())).thenReturn(null);

        PageResponse<JobApplicationDto> result = pageCache.getOrLoad(USER_ID, null, pageable, () -> page);

        assertEquals(page, result);
        verify(redisTemplate).execute(
                ArgumentMatchers.<RedisScript<Long>>any(),
                eq(List.of(USER_KEY)),
                anyString(),
                eq(jsonMapper.writeValueAsString(page)),
                eq(String.valueOf(TTL.toSeconds()))
        );
    }

    @Test
    public void getOrLoad_ShouldStillReturnLoadedPage_WhenStoringItFails() {
        when(redisTemplate.<String, String>opsForHash()).thenReturn(hashOperations);
        when(hashOperations.get(eq(USER_KEY), anyString())).thenReturn(null);
        when(redisTemplate.execute(ArgumentMatchers.<RedisScript<Long>>any(), anyList(), any(Object[].class)))
                .thenThrow(new RedisConnectionFailureException("Redis is down"));

        PageResponse<JobApplicationDto> result = pageCache.getOrLoad(USER_ID, null, pageable, () -> page);

        assertEquals(page, result);
    }

    @Test
    public void getOrLoad_ShouldFallBackToLoader_WhenRedisIsDown() {
        when(redisTemplate.<String, String>opsForHash()).thenThrow(new RedisConnectionFailureException("Redis is down"));

        PageResponse<JobApplicationDto> result = pageCache.getOrLoad(USER_ID, null, pageable, () -> page);

        assertEquals(page, result);
    }

    @Test
    public void evictUser_ShouldDeleteUserHashImmediately_WhenNoTransactionIsActive() {
        pageCache.evictUser(USER_ID);

        verify(redisTemplate).delete(USER_KEY);
    }

    @Test
    public void evictUser_ShouldDeleteUserHashOnlyAfterCommit_WhenTransactionIsActive() {
        TransactionSynchronizationManager.initSynchronization();

        pageCache.evictUser(USER_ID);
        verify(redisTemplate, never()).delete(USER_KEY);

        TransactionSynchronizationManager.getSynchronizations().forEach(TransactionSynchronization::afterCommit);
        verify(redisTemplate).delete(USER_KEY);
    }

    @Test
    public void onUserDeleted_ShouldDeleteTheDeletedUsersHash() {
        pageCache.onUserDeleted(new UserDeletedEvent(USER_ID));

        verify(redisTemplate).delete(USER_KEY);
    }

    @Test
    public void evictUser_ShouldNotThrow_WhenRedisIsDown() {
        when(redisTemplate.delete(USER_KEY)).thenThrow(new RedisConnectionFailureException("Redis is down"));

        pageCache.evictUser(USER_ID);

        verify(redisTemplate).delete(USER_KEY);
    }

    private static PageResponse<JobApplicationDto> pageOfOneApplication() {
        JobApplicationDto application = new JobApplicationDto(
                UUID.fromString("33333333-3333-3333-3333-333333333333"),
                "AppliTest",
                "City1",
                Status.PENDING,
                Position.BACKEND,
                false,
                "Initial note",
                Instant.parse("2026-07-05T09:00:00Z"),
                false
        );

        return new PageResponse<>(new ArrayList<>(List.of(application)), new PageResponse.PageMetadata(10, 0, 1, 1));
    }
}

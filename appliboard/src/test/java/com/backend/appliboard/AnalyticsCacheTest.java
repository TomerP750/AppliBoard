package com.backend.appliboard;

import com.backend.appliboard.features.analytics.AnalyticsCache;
import com.backend.appliboard.features.analytics.dto.AnalyticsDto;
import com.backend.appliboard.features.job_application.JobApplicationsChangedEvent;
import com.backend.appliboard.features.job_application.Status;
import com.backend.appliboard.features.user.UserDeletedEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import tools.jackson.databind.json.JsonMapper;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.junit.jupiter.api.Named.named;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AnalyticsCacheTest {

    private static final UUID USER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final String USER_KEY = "appliboard::analytics::" + USER_ID;
    private static final Duration MAX_TTL = Duration.ofMinutes(10);

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    private final JsonMapper jsonMapper = JsonMapper.builder().build();
    private final AnalyticsDto analytics = sampleAnalytics();

    private AnalyticsCache analyticsCache;

    @BeforeEach
    public void setUp() {
        analyticsCache = new AnalyticsCache(redisTemplate, jsonMapper);
    }

    @Test
    public void getOrLoad_ShouldReturnCachedAnalyticsWithoutLoading_WhenAnalyticsAreCached() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(USER_KEY)).thenReturn(jsonMapper.writeValueAsString(analytics));

        AnalyticsDto result = analyticsCache.getOrLoad(USER_ID, farFuture(),
                () -> fail("The database should not be queried on a cache hit"));

        assertEquals(analytics, result);
    }

    @Test
    public void getOrLoad_ShouldLoadAndStoreWithMaxTtl_WhenPeriodEndsLaterThanMaxTtl() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(USER_KEY)).thenReturn(null);

        AnalyticsDto result = analyticsCache.getOrLoad(USER_ID, farFuture(), () -> analytics);

        assertEquals(analytics, result);
        verify(valueOperations).set(USER_KEY, jsonMapper.writeValueAsString(analytics), MAX_TTL);
    }

    @Test
    public void getOrLoad_ShouldCapTtlAtPeriodEnd_WhenPeriodEndsSoonerThanMaxTtl() {
        Duration untilPeriodEnds = Duration.ofMinutes(3);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(USER_KEY)).thenReturn(null);

        analyticsCache.getOrLoad(USER_ID, Instant.now().plus(untilPeriodEnds), () -> analytics);

        ArgumentCaptor<Duration> ttlCaptor = ArgumentCaptor.forClass(Duration.class);
        verify(valueOperations).set(eq(USER_KEY), anyString(), ttlCaptor.capture());
        Duration ttl = ttlCaptor.getValue();
        assertTrue(ttl.compareTo(untilPeriodEnds) <= 0, "TTL must not outlive the period: " + ttl);
        assertTrue(ttl.compareTo(untilPeriodEnds.minusSeconds(10)) > 0, "TTL should be close to the period end: " + ttl);
    }

    @Test
    public void getOrLoad_ShouldNotStoreAnalytics_WhenPeriodHasAlreadyEnded() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(USER_KEY)).thenReturn(null);

        AnalyticsDto result = analyticsCache.getOrLoad(USER_ID, Instant.now().minusSeconds(60), () -> analytics);

        assertEquals(analytics, result);
        verify(valueOperations, never()).set(anyString(), anyString(), any(Duration.class));
    }

    @Test
    public void getOrLoad_ShouldFallBackToLoader_WhenCachedJsonIsInvalid() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(USER_KEY)).thenReturn("not json");

        AnalyticsDto result = analyticsCache.getOrLoad(USER_ID, farFuture(), () -> analytics);

        assertEquals(analytics, result);
    }

    @Test
    public void getOrLoad_ShouldFallBackToLoader_WhenRedisIsDown() {
        when(redisTemplate.opsForValue()).thenThrow(new RedisConnectionFailureException("Redis is down"));

        AnalyticsDto result = analyticsCache.getOrLoad(USER_ID, farFuture(), () -> analytics);

        assertEquals(analytics, result);
    }

    @Test
    public void getOrLoad_ShouldStillReturnLoadedAnalytics_WhenStoringThemFails() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(USER_KEY)).thenReturn(null);
        doThrow(new RedisConnectionFailureException("Redis is down"))
                .when(valueOperations).set(eq(USER_KEY), anyString(), any(Duration.class));

        AnalyticsDto result = analyticsCache.getOrLoad(USER_ID, farFuture(), () -> analytics);

        assertEquals(analytics, result);
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("evictingEvents")
    public void eventListener_ShouldDeleteTheUsersAnalytics(Consumer<AnalyticsCache> publishEvent) {
        publishEvent.accept(analyticsCache);

        verify(redisTemplate).delete(USER_KEY);
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("evictingEvents")
    public void eventListener_ShouldNotThrow_WhenRedisIsDown(Consumer<AnalyticsCache> publishEvent) {
        when(redisTemplate.delete(USER_KEY)).thenThrow(new RedisConnectionFailureException("Redis is down"));

        publishEvent.accept(analyticsCache);

        verify(redisTemplate).delete(USER_KEY);
    }

    /**
     * Every event that clears a user's cached analytics.
     */
    private static Stream<Arguments> evictingEvents() {
        return Stream.of(
                arguments(named("onJobApplicationsChanged", (Consumer<AnalyticsCache>)
                        cache -> cache.onJobApplicationsChanged(new JobApplicationsChangedEvent(USER_ID)))),
                arguments(named("onUserDeleted", (Consumer<AnalyticsCache>)
                        cache -> cache.onUserDeleted(new UserDeletedEvent(USER_ID))))
        );
    }

    private static Instant farFuture() {
        return Instant.now().plus(Duration.ofDays(1));
    }

    private static AnalyticsDto sampleAnalytics() {
        return new AnalyticsDto(
                12L,
                3L,
                Map.of(Status.PENDING, 7L, Status.IN_PROGRESS, 4L, Status.ACCEPTED, 1L),
                Map.of(DayOfWeek.MONDAY, 2L, DayOfWeek.TUESDAY, 1L),
                5L,
                Map.of(1, 2L, 15, 3L)
        );
    }
}

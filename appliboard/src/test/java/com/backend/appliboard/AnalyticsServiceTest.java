package com.backend.appliboard;

import com.backend.appliboard.features.analytics.AnalyticsCache;
import com.backend.appliboard.features.analytics.AnalyticsService;
import com.backend.appliboard.features.analytics.dto.AnalyticsDto;
import com.backend.appliboard.features.job_application.JobApplicationRepository;
import com.backend.appliboard.features.job_application.Status;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Supplier;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AnalyticsServiceTest {

    private static final UUID USER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @Mock
    private AnalyticsCache analyticsCache;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    public void getAnalytics_ShouldReturnCachedAnalytics_WithoutQueryingDatabase() {
        AnalyticsDto cachedAnalytics = new AnalyticsDto(1L, 1L, Map.of(), Map.of(), 1L, Map.of());
        when(analyticsCache.getOrLoad(eq(USER_ID), any(), any())).thenReturn(cachedAnalytics);

        AnalyticsDto result = analyticsService.getAnalytics(USER_ID);

        assertSame(cachedAnalytics, result);
        verifyNoInteractions(jobApplicationRepository);
    }

    @Test
    public void getAnalytics_ShouldExpireCacheWithinAWeek_SoWeeklyAndMonthlyFiguresNeverOutliveTheirPeriod() {
        Instant before = Instant.now();

        analyticsService.getAnalytics(USER_ID);

        ArgumentCaptor<Instant> boundaryCaptor = ArgumentCaptor.forClass(Instant.class);
        verify(analyticsCache).getOrLoad(eq(USER_ID), boundaryCaptor.capture(), any());
        Instant boundary = boundaryCaptor.getValue();
        assertTrue(boundary.isAfter(before), "The period boundary must be in the future: " + boundary);
        assertTrue(!boundary.isAfter(before.plus(Duration.ofDays(7))), "The next week starts within 7 days: " + boundary);
    }

    @Test
    public void getAnalytics_ShouldLoadZeroFilledAnalyticsFromDatabase_WhenCacheMissesAndUserHasNoApplications() {
        loadAnalyticsFromDatabaseOnCacheMiss();
        when(jobApplicationRepository.countByUserId(USER_ID)).thenReturn(0L);
        when(jobApplicationRepository.countByUserIdAndAppliedAtGreaterThanEqualAndAppliedAtLessThan(eq(USER_ID), any(), any()))
                .thenReturn(0L);
        when(jobApplicationRepository.countByUserIdAndAppliedAtGreaterThanEqualAndAppliedAtLessThanAndStatusNot(
                eq(USER_ID), any(), any(), eq(Status.PENDING))).thenReturn(0L);
        when(jobApplicationRepository.countByStatusForUser(USER_ID)).thenReturn(List.of());
        when(jobApplicationRepository.countByDayForCurrentWeek(eq(USER_ID), any(), any())).thenReturn(List.of());
        when(jobApplicationRepository.countResponsesByDayForCurrentMonth(eq(USER_ID), any(), any(), eq(Status.PENDING)))
                .thenReturn(List.of());

        AnalyticsDto result = analyticsService.getAnalytics(USER_ID);

        assertEquals(0L, result.totalApplicationsSent());
        assertEquals(0L, result.weeklyApplicationsSent());
        assertEquals(0L, result.totalMonthlySent());
        assertEquals(Status.values().length, result.countByStatus().size());
        assertTrue(result.countByStatus().values().stream().allMatch(count -> count == 0L));
        assertEquals(DayOfWeek.values().length, result.weeklyApplicationsByDay().size());
        assertEquals(31, result.totalMonthlyResponses().size());
    }

    /** Simulates a cache miss: the analytics cache calls the loader (the database queries) it was given. */
    private void loadAnalyticsFromDatabaseOnCacheMiss() {
        when(analyticsCache.getOrLoad(eq(USER_ID), any(), any()))
                .thenAnswer(invocation -> invocation.<Supplier<AnalyticsDto>>getArgument(2).get());
    }
}

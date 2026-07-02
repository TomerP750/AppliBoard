package com.backend.appliboard.features.analytics;

import com.backend.appliboard.features.analytics.dto.AnalyticsDto;
import com.backend.appliboard.features.job_application.JobApplicationRepository;
import com.backend.appliboard.features.job_application.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnalyticsService implements IAnalyticsService {

    private final JobApplicationRepository jobApplicationRepository;

    @Override
    public AnalyticsDto getAnalytics(UUID userId) {
        return new AnalyticsDto(
                getTotalApplicationSent(userId),
                getWeeklyApplicationsSent(userId),
                getCountByStatus(userId),
                getWeeklyApplicationsByDay(userId)
        );
    }

    private Long getTotalApplicationSent(UUID userId) {
        return jobApplicationRepository.countByUserId(userId);
    }

    private Long getWeeklyApplicationsSent(UUID userId) {
        Instant startOfWeek = getStartOfCurrentWeek();
        Instant startOfNextWeek = getStartOfNextWeek(startOfWeek);

        return jobApplicationRepository.countByUserIdAndAppliedAtGreaterThanEqualAndAppliedAtLessThan(
                userId,
                startOfWeek,
                startOfNextWeek
        );
    }

    private Map<Status, Long> getCountByStatus(UUID userId) {
        Map<Status, Long> countByStatus = createEmptyStatusCountMap();
        addSavedStatusCounts(userId, countByStatus);

        return countByStatus;
    }

    private Map<DayOfWeek, Long> getWeeklyApplicationsByDay(UUID userId) {
        Instant startOfWeek = getStartOfCurrentWeek();
        Instant startOfNextWeek = getStartOfNextWeek(startOfWeek);
        Map<DayOfWeek, Long> countByDay = createEmptyWeekCountMap();

        for (JobApplicationRepository.DayCount dayCount : jobApplicationRepository.countByDayForCurrentWeek(
                userId,
                startOfWeek,
                startOfNextWeek
        )) {
            countByDay.put(toDayOfWeek(dayCount.getDayOfWeek()), dayCount.getCount());
        }

        return countByDay;
    }

    private Map<Status, Long> createEmptyStatusCountMap() {
        Map<Status, Long> countByStatus = new EnumMap<>(Status.class);
        for (Status status : Status.values()) {
            countByStatus.put(status, 0L);
        }

        return countByStatus;
    }

    private void addSavedStatusCounts(UUID userId, Map<Status, Long> countByStatus) {
        for (JobApplicationRepository.StatusCount statusCount : jobApplicationRepository.countByStatusForUser(userId)) {
            countByStatus.put(statusCount.getStatus(), statusCount.getCount());
        }
    }

    private Instant getStartOfCurrentWeek() {
        ZoneId zoneId = ZoneId.systemDefault();
        LocalDate currentSunday = LocalDate.now(zoneId)
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));

        return currentSunday.atStartOfDay(zoneId).toInstant();
    }

    private Instant getStartOfNextWeek(Instant startOfWeek) {
        return startOfWeek.atZone(ZoneId.systemDefault())
                .plusWeeks(1)
                .toInstant();
    }

    private Map<DayOfWeek, Long> createEmptyWeekCountMap() {
        Map<DayOfWeek, Long> countByDay = new EnumMap<>(DayOfWeek.class);
        for (DayOfWeek dayOfWeek : DayOfWeek.values()) {
            countByDay.put(dayOfWeek, 0L);
        }

        return countByDay;
    }

    private DayOfWeek toDayOfWeek(Integer mysqlDayOfWeek) {
        return switch (mysqlDayOfWeek) {
            case 1 -> DayOfWeek.SUNDAY;
            case 2 -> DayOfWeek.MONDAY;
            case 3 -> DayOfWeek.TUESDAY;
            case 4 -> DayOfWeek.WEDNESDAY;
            case 5 -> DayOfWeek.THURSDAY;
            case 6 -> DayOfWeek.FRIDAY;
            case 7 -> DayOfWeek.SATURDAY;
            default -> throw new IllegalArgumentException("Unexpected day of week: " + mysqlDayOfWeek);
        };
    }
}

package com.backend.appliboard.features.analytics;

import com.backend.appliboard.features.job_application.JobApplicationRepository;

import java.time.DayOfWeek;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Builds per-day application counts from the MySQL {@code DAYOFWEEK} query results.
 * Shared by the analytics and weekly review features.
 */
public final class DayOfWeekCounts {

    private DayOfWeekCounts() {
    }

    /**
     * @param dayCounts rows from {@link JobApplicationRepository#countByDayForCurrentWeek}
     * @return a count for every day of the week, with 0 for days that have no rows
     */
    public static Map<DayOfWeek, Long> fromDayCounts(List<JobApplicationRepository.DayCount> dayCounts) {
        Map<DayOfWeek, Long> countByDay = createEmptyWeek();
        for (JobApplicationRepository.DayCount dayCount : dayCounts) {
            countByDay.put(fromMysqlDayOfWeek(dayCount.getDayOfWeek()), dayCount.getCount());
        }

        return countByDay;
    }

    private static Map<DayOfWeek, Long> createEmptyWeek() {
        Map<DayOfWeek, Long> countByDay = new EnumMap<>(DayOfWeek.class);
        for (DayOfWeek dayOfWeek : DayOfWeek.values()) {
            countByDay.put(dayOfWeek, 0L);
        }

        return countByDay;
    }

    /** MySQL {@code DAYOFWEEK} returns 1 for Sunday through 7 for Saturday. */
    private static DayOfWeek fromMysqlDayOfWeek(Integer mysqlDayOfWeek) {
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

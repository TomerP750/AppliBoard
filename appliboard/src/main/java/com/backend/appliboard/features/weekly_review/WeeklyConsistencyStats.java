package com.backend.appliboard.features.weekly_review;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

/**
 * Consistency numbers for one week, computed in code so the AI only describes them.
 *
 * @param countByDay        applications sent on each day of the analyzed week
 * @param totalApplications applications sent during the week
 * @param previousWeekTotal applications sent during the week before
 * @param activeDays        days with at least one application
 * @param longestStreak     most consecutive active days (Sunday to Saturday)
 */
public record WeeklyConsistencyStats(
        Map<DayOfWeek, Long> countByDay,
        long totalApplications,
        long previousWeekTotal,
        int activeDays,
        int longestStreak
) {

    /** Days in the order the week runs here (Sunday first, as in the analytics feature). */
    static final List<DayOfWeek> WEEK_ORDER = List.of(
            DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY
    );

    public static WeeklyConsistencyStats of(Map<DayOfWeek, Long> countByDay, long previousWeekTotal) {
        return new WeeklyConsistencyStats(
                countByDay,
                sumApplications(countByDay),
                previousWeekTotal,
                countActiveDays(countByDay),
                findLongestStreak(countByDay)
        );
    }

    public ReviewTrend trend() {
        if (totalApplications > previousWeekTotal) {
            return ReviewTrend.UP;
        }
        if (totalApplications < previousWeekTotal) {
            return ReviewTrend.DOWN;
        }
        return ReviewTrend.NEUTRAL;
    }

    private static long sumApplications(Map<DayOfWeek, Long> countByDay) {
        return countByDay.values().stream().mapToLong(Long::longValue).sum();
    }

    private static int countActiveDays(Map<DayOfWeek, Long> countByDay) {
        return (int) WEEK_ORDER.stream().filter(day -> isActive(countByDay, day)).count();
    }

    private static int findLongestStreak(Map<DayOfWeek, Long> countByDay) {
        int longestStreak = 0;
        int currentStreak = 0;
        for (DayOfWeek day : WEEK_ORDER) {
            currentStreak = isActive(countByDay, day) ? currentStreak + 1 : 0;
            longestStreak = Math.max(longestStreak, currentStreak);
        }

        return longestStreak;
    }

    private static boolean isActive(Map<DayOfWeek, Long> countByDay, DayOfWeek day) {
        return countByDay.getOrDefault(day, 0L) > 0;
    }
}

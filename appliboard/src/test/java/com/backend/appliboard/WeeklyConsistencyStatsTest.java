package com.backend.appliboard;

import com.backend.appliboard.features.weekly_review.ReviewTrend;
import com.backend.appliboard.features.weekly_review.WeeklyConsistencyStats;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.time.DayOfWeek;
import java.util.EnumMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class WeeklyConsistencyStatsTest {

    @Test
    public void of_ShouldCountTotalActiveDaysAndLongestStreak_WhenWeekHasGaps() {
        Map<DayOfWeek, Long> countByDay = new EnumMap<>(DayOfWeek.class);
        countByDay.put(DayOfWeek.SUNDAY, 1L);
        countByDay.put(DayOfWeek.MONDAY, 2L);
        countByDay.put(DayOfWeek.WEDNESDAY, 1L);
        countByDay.put(DayOfWeek.THURSDAY, 3L);
        countByDay.put(DayOfWeek.FRIDAY, 1L);

        WeeklyConsistencyStats stats = WeeklyConsistencyStats.of(countByDay, 4L);

        assertStats(stats, 8L, 5, 3);
        assertEquals(4L, stats.previousWeekTotal());
    }

    @Test
    public void of_ShouldReturnZeros_WhenWeekIsEmpty() {
        WeeklyConsistencyStats stats = WeeklyConsistencyStats.of(new EnumMap<>(DayOfWeek.class), 0L);

        assertStats(stats, 0L, 0, 0);
    }

    @Test
    public void of_ShouldCountFullStreak_WhenEveryDayIsActive() {
        Map<DayOfWeek, Long> countByDay = new EnumMap<>(DayOfWeek.class);
        for (DayOfWeek day : DayOfWeek.values()) {
            countByDay.put(day, 1L);
        }

        WeeklyConsistencyStats stats = WeeklyConsistencyStats.of(countByDay, 0L);

        assertStats(stats, 7L, 7, 7);
    }

    @Test
    public void of_ShouldNotJoinSaturdayAndSunday_BecauseTheWeekStartsOnSunday() {
        Map<DayOfWeek, Long> countByDay = new EnumMap<>(DayOfWeek.class);
        countByDay.put(DayOfWeek.SATURDAY, 1L);
        countByDay.put(DayOfWeek.SUNDAY, 1L);

        WeeklyConsistencyStats stats = WeeklyConsistencyStats.of(countByDay, 0L);

        assertStats(stats, 2L, 2, 1);
    }

    @ParameterizedTest(name = "{0} this week vs {1} before -> {2}")
    @CsvSource({
            "3, 1, UP",
            "1, 3, DOWN",
            "2, 2, NEUTRAL",
            "0, 0, NEUTRAL"
    })
    public void trend_ShouldCompareWithPreviousWeek(long totalApplications, long previousWeekTotal, ReviewTrend expectedTrend) {
        Map<DayOfWeek, Long> countByDay = new EnumMap<>(DayOfWeek.class);
        countByDay.put(DayOfWeek.MONDAY, totalApplications);

        WeeklyConsistencyStats stats = WeeklyConsistencyStats.of(countByDay, previousWeekTotal);

        assertEquals(expectedTrend, stats.trend());
    }

    private void assertStats(WeeklyConsistencyStats stats, long totalApplications, int activeDays, int longestStreak) {
        assertEquals(totalApplications, stats.totalApplications());
        assertEquals(activeDays, stats.activeDays());
        assertEquals(longestStreak, stats.longestStreak());
    }
}

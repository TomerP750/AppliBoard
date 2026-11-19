package com.backend.appliboard.features.weekly_review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalAdjusters;

/**
 * Works out the weekly review window: one review per user from Sunday 08:00 until the next
 * Sunday 08:00 (server time zone). The review analyzes the full Sunday-to-Saturday week that
 * ended right before the window opened.
 */
@Component
public class WeeklyReviewWindow {

    private static final DayOfWeek RESET_DAY = DayOfWeek.SUNDAY;
    private static final LocalTime RESET_TIME = LocalTime.of(8, 0);

    private final Clock clock;

    @Autowired
    public WeeklyReviewWindow() {
        this(Clock.systemDefaultZone());
    }

    /** For tests: fixes "now" to the given clock. */
    public WeeklyReviewWindow(Clock clock) {
        this.clock = clock;
    }

    public ReviewPeriod currentPeriod() {
        ZonedDateTime windowStart = findCurrentWindowStart();
        ZonedDateTime weekEnd = windowStart.toLocalDate().atStartOfDay(windowStart.getZone());
        ZonedDateTime weekStart = weekEnd.minusWeeks(1);

        return new ReviewPeriod(
                windowStart.toInstant(),
                windowStart.plusWeeks(1).toInstant(),
                weekStart.toInstant(),
                weekEnd.toInstant(),
                weekStart.minusWeeks(1).toInstant()
        );
    }

    private ZonedDateTime findCurrentWindowStart() {
        ZonedDateTime now = ZonedDateTime.now(clock);
        LocalDate resetDate = now.toLocalDate().with(TemporalAdjusters.previousOrSame(RESET_DAY));
        ZonedDateTime windowStart = resetDate.atTime(RESET_TIME).atZone(now.getZone());

        return windowStart.isAfter(now) ? windowStart.minusWeeks(1) : windowStart;
    }
}

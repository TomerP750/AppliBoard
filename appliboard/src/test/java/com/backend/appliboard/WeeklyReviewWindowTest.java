package com.backend.appliboard;

import com.backend.appliboard.features.weekly_review.ReviewPeriod;
import com.backend.appliboard.features.weekly_review.WeeklyReviewWindow;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** 2026-11-22 is a Sunday. UTC is used so daylight saving time doesn't shift the expected values. */
public class WeeklyReviewWindowTest {

    @ParameterizedTest(name = "now {0} -> window starts {1}")
    @CsvSource({
            "2026-11-22T08:00:00Z, 2026-11-22T08:00:00Z",  // exactly at the reset
            "2026-11-22T07:59:59Z, 2026-11-15T08:00:00Z",  // one second before the reset
            "2026-11-21T23:00:00Z, 2026-11-15T08:00:00Z",  // Saturday night
            "2026-11-19T12:00:00Z, 2026-11-15T08:00:00Z",  // mid-week
            "2026-11-28T23:59:59Z, 2026-11-22T08:00:00Z"   // last second of the window
    })
    public void currentPeriod_ShouldStartWindowAtMostRecentSundayEightAm(String now, String expectedWindowStart) {
        ReviewPeriod period = windowAt(now).currentPeriod();

        assertEquals(Instant.parse(expectedWindowStart), period.windowStart());
    }

    @Test
    public void currentPeriod_ShouldAnalyzeTheFullWeekBeforeTheWindow() {
        ReviewPeriod period = windowAt("2026-11-24T10:00:00Z").currentPeriod();

        assertEquals(Instant.parse("2026-11-22T08:00:00Z"), period.windowStart());
        assertEquals(Instant.parse("2026-11-29T08:00:00Z"), period.nextWindowStart());
        assertEquals(Instant.parse("2026-11-15T00:00:00Z"), period.weekStart());
        assertEquals(Instant.parse("2026-11-22T00:00:00Z"), period.weekEnd());
        assertEquals(Instant.parse("2026-11-08T00:00:00Z"), period.previousWeekStart());
    }

    private WeeklyReviewWindow windowAt(String now) {
        return new WeeklyReviewWindow(Clock.fixed(Instant.parse(now), ZoneOffset.UTC));
    }
}

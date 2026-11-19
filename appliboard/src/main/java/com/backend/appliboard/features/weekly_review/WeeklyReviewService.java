package com.backend.appliboard.features.weekly_review;

import com.backend.appliboard.features.analytics.DayOfWeekCounts;
import com.backend.appliboard.features.job_application.JobApplicationRepository;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserService;
import com.backend.appliboard.features.weekly_review.dto.AiWeeklyReviewResult;
import com.backend.appliboard.features.weekly_review.dto.WeeklyReviewDto;
import com.backend.appliboard.features.weekly_review.dto.WeeklyReviewStatusDto;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class WeeklyReviewService implements IWeeklyReviewService {

    private static final String ALREADY_GENERATED_MESSAGE =
            "You already generated this week's review. A new one is available on Sunday at 08:00.";

    private final WeeklyReviewRepository weeklyReviewRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserService userService;
    private final WeeklyReviewWindow weeklyReviewWindow;
    private final WeeklyReviewAiWriter weeklyReviewAiWriter;

    @Override
    public WeeklyReviewStatusDto getCurrentReview(UUID userId) {
        ReviewPeriod period = weeklyReviewWindow.currentPeriod();
        WeeklyReviewDto currentReview = weeklyReviewRepository
                .findByUserIdAndWindowStart(userId, period.windowStart())
                .map(WeeklyReviewMapper::toDto)
                .orElse(null);

        return new WeeklyReviewStatusDto(
                currentReview,
                currentReview == null,
                period.weekStart(),
                period.weekEnd(),
                period.nextWindowStart()
        );
    }

    /**
     * Not {@code @Transactional} on purpose: the AI call can take several seconds and should not
     * hold a database connection. The unique index on (user, window) still prevents duplicates
     * when two requests pass the first check at the same time.
     */
    @Override
    public WeeklyReviewDto generateReview(UUID userId) throws FoundException, NotFoundException {
        ReviewPeriod period = weeklyReviewWindow.currentPeriod();
        ensureNoReviewInWindow(userId, period);

        User user = userService.fetchUserEntity(userId);
        WeeklyConsistencyStats stats = computeStats(userId, period);
        AiWeeklyReviewResult aiResult = weeklyReviewAiWriter.writeReview(stats);

        WeeklyReview savedReview = saveReview(buildReview(user, period, stats, aiResult));
        log.info("Weekly review generated for the week starting {}", period.weekStart());

        return WeeklyReviewMapper.toDto(savedReview);
    }

    @Override
    public Page<WeeklyReviewDto> getHistory(UUID userId, Pageable pageable) {
        return weeklyReviewRepository
                .findByUserIdOrderByWeekStartDesc(userId, pageable)
                .map(WeeklyReviewMapper::toDto);
    }

    private void ensureNoReviewInWindow(UUID userId, ReviewPeriod period) throws FoundException {
        if (weeklyReviewRepository.existsByUserIdAndWindowStart(userId, period.windowStart())) {
            throw new FoundException(ALREADY_GENERATED_MESSAGE);
        }
    }

    private WeeklyConsistencyStats computeStats(UUID userId, ReviewPeriod period) {
        Map<DayOfWeek, Long> countByDay = DayOfWeekCounts.fromDayCounts(
                jobApplicationRepository.countByDayForCurrentWeek(userId, period.weekStart(), period.weekEnd())
        );
        Long previousWeekTotal = jobApplicationRepository.countByUserIdAndAppliedAtGreaterThanEqualAndAppliedAtLessThan(
                userId, period.previousWeekStart(), period.weekStart()
        );

        return WeeklyConsistencyStats.of(countByDay, previousWeekTotal == null ? 0L : previousWeekTotal);
    }

    private WeeklyReview buildReview(
            User user, ReviewPeriod period, WeeklyConsistencyStats stats, AiWeeklyReviewResult aiResult
    ) {
        return WeeklyReview.builder()
                .user(user)
                .windowStart(period.windowStart())
                .weekStart(period.weekStart())
                .weekEnd(period.weekEnd())
                .summary(aiResult.summary())
                .trend(stats.trend())
                .totalApplications(stats.totalApplications())
                .activeDays(stats.activeDays())
                .longestStreak(stats.longestStreak())
                .notes(WeeklyReviewMapper.toNotes(aiResult.notes()))
                .build();
    }

    private WeeklyReview saveReview(WeeklyReview review) throws FoundException {
        try {
            return weeklyReviewRepository.saveAndFlush(review);
        } catch (DataIntegrityViolationException exception) {
            throw new FoundException(ALREADY_GENERATED_MESSAGE);
        }
    }
}

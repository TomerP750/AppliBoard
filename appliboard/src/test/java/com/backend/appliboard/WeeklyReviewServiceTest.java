package com.backend.appliboard;

import com.backend.appliboard.features.job_application.JobApplicationRepository;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserService;
import com.backend.appliboard.features.weekly_review.ReviewNote;
import com.backend.appliboard.features.weekly_review.ReviewNoteType;
import com.backend.appliboard.features.weekly_review.ReviewPeriod;
import com.backend.appliboard.features.weekly_review.ReviewTrend;
import com.backend.appliboard.features.weekly_review.WeeklyConsistencyStats;
import com.backend.appliboard.features.weekly_review.WeeklyReview;
import com.backend.appliboard.features.weekly_review.WeeklyReviewAiWriter;
import com.backend.appliboard.features.weekly_review.WeeklyReviewRepository;
import com.backend.appliboard.features.weekly_review.WeeklyReviewService;
import com.backend.appliboard.features.weekly_review.WeeklyReviewWindow;
import com.backend.appliboard.features.weekly_review.dto.AiWeeklyReviewResult;
import com.backend.appliboard.features.weekly_review.dto.ReviewNoteDto;
import com.backend.appliboard.features.weekly_review.dto.WeeklyReviewDto;
import com.backend.appliboard.features.weekly_review.dto.WeeklyReviewStatusDto;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import com.backend.appliboard.support.TestFixtures;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WeeklyReviewServiceTest {

    private static final UUID USER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID REVIEW_ID = UUID.fromString("44444444-4444-4444-4444-444444444444");

    private static final ReviewPeriod PERIOD = new ReviewPeriod(
            Instant.parse("2026-11-22T08:00:00Z"),
            Instant.parse("2026-11-29T08:00:00Z"),
            Instant.parse("2026-11-15T00:00:00Z"),
            Instant.parse("2026-11-22T00:00:00Z"),
            Instant.parse("2026-11-08T00:00:00Z")
    );
    private static final Instant CREATED_AT = Instant.parse("2026-11-22T09:30:00Z");

    private static final int MYSQL_SUNDAY = 1;
    private static final int MYSQL_MONDAY = 2;

    private static final AiWeeklyReviewResult AI_RESULT = new AiWeeklyReviewResult(
            "You applied on two days in a row.",
            List.of(
                    new ReviewNoteDto("Strong start on Sunday.", ReviewNoteType.GOOD),
                    new ReviewNoteDto("Try applying mid-week too.", ReviewNoteType.IMPROVE)
            )
    );

    @Mock
    private WeeklyReviewRepository weeklyReviewRepository;

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @Mock
    private UserService userService;

    @Mock
    private WeeklyReviewWindow weeklyReviewWindow;

    @Mock
    private WeeklyReviewAiWriter weeklyReviewAiWriter;

    @InjectMocks
    private WeeklyReviewService weeklyReviewService;

    private User user;
    private WeeklyReview weeklyReview;

    @BeforeEach
    public void setUp() {
        user = TestFixtures.user(USER_ID);

        weeklyReview = WeeklyReview.builder()
                .id(REVIEW_ID)
                .user(user)
                .windowStart(PERIOD.windowStart())
                .weekStart(PERIOD.weekStart())
                .weekEnd(PERIOD.weekEnd())
                .summary(AI_RESULT.summary())
                .trend(ReviewTrend.UP)
                .totalApplications(3)
                .activeDays(2)
                .longestStreak(2)
                .notes(new ArrayList<>(List.of(
                        new ReviewNote("Strong start on Sunday.", ReviewNoteType.GOOD),
                        new ReviewNote("Try applying mid-week too.", ReviewNoteType.IMPROVE)
                )))
                .createdAt(CREATED_AT)
                .build();
    }

    @Test
    public void getCurrentReview_ShouldReturnReviewAndBlockGenerating_WhenReviewExistsInWindow() {
        when(weeklyReviewWindow.currentPeriod()).thenReturn(PERIOD);
        when(weeklyReviewRepository.findByUserIdAndWindowStart(USER_ID, PERIOD.windowStart()))
                .thenReturn(Optional.of(weeklyReview));

        WeeklyReviewStatusDto result = weeklyReviewService.getCurrentReview(USER_ID);

        assertMatchesWeeklyReview(result.review());
        assertFalse(result.canGenerate());
        assertMatchesPeriod(result);
    }

    @Test
    public void getCurrentReview_ShouldAllowGenerating_WhenNoReviewInWindow() {
        when(weeklyReviewWindow.currentPeriod()).thenReturn(PERIOD);
        when(weeklyReviewRepository.findByUserIdAndWindowStart(USER_ID, PERIOD.windowStart()))
                .thenReturn(Optional.empty());

        WeeklyReviewStatusDto result = weeklyReviewService.getCurrentReview(USER_ID);

        assertNull(result.review());
        assertTrue(result.canGenerate());
        assertMatchesPeriod(result);
    }

    @Test
    public void generateReview_ShouldPassComputedStatsToAiWriter_WhenNoReviewInWindow() throws Exception {
        stubSuccessfulGeneration(1L);

        weeklyReviewService.generateReview(USER_ID);

        ArgumentCaptor<WeeklyConsistencyStats> statsCaptor = ArgumentCaptor.forClass(WeeklyConsistencyStats.class);
        verify(weeklyReviewAiWriter).writeReview(statsCaptor.capture());
        WeeklyConsistencyStats stats = statsCaptor.getValue();
        assertEquals(3L, stats.totalApplications());
        assertEquals(1L, stats.previousWeekTotal());
        assertEquals(2, stats.activeDays());
        assertEquals(2, stats.longestStreak());
    }

    @Test
    public void generateReview_ShouldSaveReviewWithStatsAndAiText_WhenNoReviewInWindow() throws Exception {
        stubSuccessfulGeneration(1L);

        WeeklyReviewDto result = weeklyReviewService.generateReview(USER_ID);

        ArgumentCaptor<WeeklyReview> reviewCaptor = ArgumentCaptor.forClass(WeeklyReview.class);
        verify(weeklyReviewRepository).saveAndFlush(reviewCaptor.capture());
        WeeklyReview savedReview = reviewCaptor.getValue();
        assertEquals(user, savedReview.getUser());
        assertEquals(PERIOD.windowStart(), savedReview.getWindowStart());
        assertEquals(PERIOD.weekStart(), savedReview.getWeekStart());
        assertEquals(PERIOD.weekEnd(), savedReview.getWeekEnd());
        assertEquals(AI_RESULT.summary(), savedReview.getSummary());
        assertEquals(ReviewTrend.UP, savedReview.getTrend());
        assertEquals(3L, savedReview.getTotalApplications());
        assertEquals(2, savedReview.getActiveDays());
        assertEquals(2, savedReview.getLongestStreak());
        assertEquals(AI_RESULT.notes(), result.notes());
    }

    @Test
    public void generateReview_ShouldUseZeroPreviousWeekTotal_WhenCountIsNull() throws Exception {
        stubSuccessfulGeneration(null);

        weeklyReviewService.generateReview(USER_ID);

        ArgumentCaptor<WeeklyConsistencyStats> statsCaptor = ArgumentCaptor.forClass(WeeklyConsistencyStats.class);
        verify(weeklyReviewAiWriter).writeReview(statsCaptor.capture());
        assertEquals(0L, statsCaptor.getValue().previousWeekTotal());
    }

    @Test
    public void generateReview_ShouldThrowFoundException_WhenReviewAlreadyExistsInWindow() throws Exception {
        when(weeklyReviewWindow.currentPeriod()).thenReturn(PERIOD);
        when(weeklyReviewRepository.existsByUserIdAndWindowStart(USER_ID, PERIOD.windowStart())).thenReturn(true);

        FoundException exception = assertThrows(FoundException.class,
                () -> weeklyReviewService.generateReview(USER_ID));

        assertTrue(exception.getMessage().contains("Sunday at 08:00"));
        verify(userService, never()).fetchUserEntity(USER_ID);
        verify(weeklyReviewAiWriter, never()).writeReview(any());
        verify(weeklyReviewRepository, never()).saveAndFlush(any());
    }

    @Test
    public void generateReview_ShouldThrowFoundException_WhenUniqueIndexRejectsConcurrentDuplicate() throws Exception {
        stubGenerationUntilSave(1L);
        when(weeklyReviewRepository.saveAndFlush(any(WeeklyReview.class)))
                .thenThrow(new DataIntegrityViolationException("Duplicate entry"));

        assertThrows(FoundException.class, () -> weeklyReviewService.generateReview(USER_ID));
    }

    @Test
    public void generateReview_ShouldThrowNotFoundException_WhenUserDoesNotExist() throws Exception {
        when(weeklyReviewWindow.currentPeriod()).thenReturn(PERIOD);
        when(weeklyReviewRepository.existsByUserIdAndWindowStart(USER_ID, PERIOD.windowStart())).thenReturn(false);
        when(userService.fetchUserEntity(USER_ID)).thenThrow(new NotFoundException("User not found"));

        assertThrows(NotFoundException.class, () -> weeklyReviewService.generateReview(USER_ID));

        verify(weeklyReviewAiWriter, never()).writeReview(any());
        verify(weeklyReviewRepository, never()).saveAndFlush(any());
    }

    @Test
    public void generateReview_ShouldNotSave_WhenAiWriterFails() throws Exception {
        stubStatsQueries(1L);
        when(weeklyReviewAiWriter.writeReview(any(WeeklyConsistencyStats.class)))
                .thenThrow(new IllegalStateException("The AI returned an empty weekly review"));

        assertThrows(IllegalStateException.class, () -> weeklyReviewService.generateReview(USER_ID));

        verify(weeklyReviewRepository, never()).saveAndFlush(any());
    }

    @Test
    public void getHistory_ShouldReturnMappedReviews() {
        Pageable pageable = PageRequest.of(0, 10);
        when(weeklyReviewRepository.findByUserIdOrderByWeekStartDesc(USER_ID, pageable))
                .thenReturn(new PageImpl<>(List.of(weeklyReview), pageable, 1));

        Page<WeeklyReviewDto> result = weeklyReviewService.getHistory(USER_ID, pageable);

        assertEquals(1, result.getTotalElements());
        assertMatchesWeeklyReview(result.getContent().get(0));
    }

    @Test
    public void getHistory_ShouldReturnEmptyPage_WhenUserHasNoReviews() {
        Pageable pageable = PageRequest.of(0, 10);
        when(weeklyReviewRepository.findByUserIdOrderByWeekStartDesc(USER_ID, pageable))
                .thenReturn(Page.empty(pageable));

        Page<WeeklyReviewDto> result = weeklyReviewService.getHistory(USER_ID, pageable);

        assertTrue(result.isEmpty());
    }

    /** Last week: 2 applications on Sunday and 1 on Monday. */
    private void stubStatsQueries(Long previousWeekTotal) throws NotFoundException {
        when(weeklyReviewWindow.currentPeriod()).thenReturn(PERIOD);
        when(weeklyReviewRepository.existsByUserIdAndWindowStart(USER_ID, PERIOD.windowStart())).thenReturn(false);
        when(userService.fetchUserEntity(USER_ID)).thenReturn(user);
        when(jobApplicationRepository.countByDayForCurrentWeek(USER_ID, PERIOD.weekStart(), PERIOD.weekEnd()))
                .thenReturn(List.of(dayCount(MYSQL_SUNDAY, 2L), dayCount(MYSQL_MONDAY, 1L)));
        when(jobApplicationRepository.countByUserIdAndAppliedAtGreaterThanEqualAndAppliedAtLessThan(
                USER_ID, PERIOD.previousWeekStart(), PERIOD.weekStart()
        )).thenReturn(previousWeekTotal);
    }

    private void stubGenerationUntilSave(Long previousWeekTotal) throws NotFoundException {
        stubStatsQueries(previousWeekTotal);
        when(weeklyReviewAiWriter.writeReview(any(WeeklyConsistencyStats.class))).thenReturn(AI_RESULT);
    }

    private void stubSuccessfulGeneration(Long previousWeekTotal) throws NotFoundException {
        stubGenerationUntilSave(previousWeekTotal);
        when(weeklyReviewRepository.saveAndFlush(any(WeeklyReview.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    private void assertMatchesWeeklyReview(WeeklyReviewDto dto) {
        assertEquals(REVIEW_ID, dto.id());
        assertEquals(PERIOD.weekStart(), dto.weekStart());
        assertEquals(PERIOD.weekEnd(), dto.weekEnd());
        assertEquals(AI_RESULT.summary(), dto.summary());
        assertEquals(ReviewTrend.UP, dto.trend());
        assertEquals(AI_RESULT.notes(), dto.notes());
        assertEquals(3L, dto.totalApplications());
        assertEquals(2, dto.activeDays());
        assertEquals(2, dto.longestStreak());
        assertEquals(CREATED_AT, dto.createdAt());
    }

    private void assertMatchesPeriod(WeeklyReviewStatusDto dto) {
        assertEquals(PERIOD.weekStart(), dto.weekStart());
        assertEquals(PERIOD.weekEnd(), dto.weekEnd());
        assertEquals(PERIOD.nextWindowStart(), dto.nextAvailableAt());
    }

    private static JobApplicationRepository.DayCount dayCount(int mysqlDayOfWeek, long count) {
        return new JobApplicationRepository.DayCount() {
            @Override
            public Integer getDayOfWeek() {
                return mysqlDayOfWeek;
            }

            @Override
            public Long getCount() {
                return count;
            }
        };
    }
}

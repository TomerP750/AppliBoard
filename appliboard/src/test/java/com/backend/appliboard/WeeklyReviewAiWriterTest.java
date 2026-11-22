package com.backend.appliboard;

import com.backend.appliboard.features.weekly_review.ReviewNoteType;
import com.backend.appliboard.features.weekly_review.WeeklyConsistencyStats;
import com.backend.appliboard.features.weekly_review.WeeklyReviewAiWriter;
import com.backend.appliboard.features.weekly_review.dto.AiWeeklyReviewResult;
import com.backend.appliboard.features.weekly_review.dto.ReviewNoteDto;
import com.backend.appliboard.shared.exceptions.AiUnavailableException;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.ObjectProvider;

import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Named.named;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WeeklyReviewAiWriterTest {

    private static final ReviewNoteDto GOOD_NOTE = new ReviewNoteDto("You applied 3 days in a row.", ReviewNoteType.GOOD);
    private static final ReviewNoteDto IMPROVE_NOTE = new ReviewNoteDto("Add one application on Thursday.", ReviewNoteType.IMPROVE);

    /** Deep stubs mock Spring AI's chained calls: prompt().system().user().call().entity(). */
    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private ChatClient chatClient;

    @Mock
    private ObjectProvider<ChatClient> chatClientProvider;

    /** A real validator, so the tests check the actual rules on the DTOs. */
    private static final Validator VALIDATOR = Validation.buildDefaultValidatorFactory().getValidator();

    private WeeklyReviewAiWriter weeklyReviewAiWriter;
    private WeeklyConsistencyStats stats;

    @BeforeEach
    public void setUp() {
        weeklyReviewAiWriter = new WeeklyReviewAiWriter(chatClientProvider, VALIDATOR);

        Map<DayOfWeek, Long> countByDay = new EnumMap<>(DayOfWeek.class);
        countByDay.put(DayOfWeek.MONDAY, 2L);
        countByDay.put(DayOfWeek.TUESDAY, 1L);
        stats = WeeklyConsistencyStats.of(countByDay, 5L);
    }

    @Test
    public void writeReview_ShouldReturnTrimmedSummaryAndNotes_WhenAiResultIsValid() {
        stubAiResult(new AiWeeklyReviewResult("  A steady week.  ", List.of(GOOD_NOTE, IMPROVE_NOTE)));

        AiWeeklyReviewResult result = weeklyReviewAiWriter.writeReview(stats);

        assertEquals("A steady week.", result.summary());
        assertEquals(List.of(GOOD_NOTE, IMPROVE_NOTE), result.notes());
    }

    @Test
    public void writeReview_ShouldDropUnusableNotes_WhenSomeNotesAreInvalid() {
        List<ReviewNoteDto> notes = Arrays.asList(
                GOOD_NOTE,
                null,
                new ReviewNoteDto("No type", null),
                new ReviewNoteDto("   ", ReviewNoteType.NEUTRAL),
                new ReviewNoteDto("x".repeat(501), ReviewNoteType.NEUTRAL),
                IMPROVE_NOTE
        );
        stubAiResult(new AiWeeklyReviewResult("A steady week.", notes));

        AiWeeklyReviewResult result = weeklyReviewAiWriter.writeReview(stats);

        assertEquals(List.of(GOOD_NOTE, IMPROVE_NOTE), result.notes());
    }

    @Test
    public void writeReview_ShouldThrowAiUnavailableException_WhenAiIsNotConfigured() {
        when(chatClientProvider.getIfAvailable()).thenReturn(null);

        AiUnavailableException exception = assertThrows(AiUnavailableException.class,
                () -> weeklyReviewAiWriter.writeReview(stats));

        assertTrue(exception.getMessage().contains("not configured"));
    }

    @Test
    public void writeReview_ShouldSendComputedNumbersInUserMessage() {
        ArgumentCaptor<String> userMessageCaptor = ArgumentCaptor.forClass(String.class);
        when(chatClientProvider.getIfAvailable()).thenReturn(chatClient);
        when(chatClient.prompt()
                .system(anyString())
                .user(userMessageCaptor.capture())
                .call()
                .entity(AiWeeklyReviewResult.class)
        ).thenReturn(new AiWeeklyReviewResult("A steady week.", List.of(GOOD_NOTE)));

        weeklyReviewAiWriter.writeReview(stats);

        String userMessage = userMessageCaptor.getValue();
        assertTrue(userMessage.contains("- Monday: 2"));
        assertTrue(userMessage.contains("- Wednesday: 0"));
        assertTrue(userMessage.contains("Total applications: 3"));
        assertTrue(userMessage.contains("Total applications the week before: 5"));
        assertTrue(userMessage.contains("Active days (at least one application): 2 of 7"));
        assertTrue(userMessage.contains("Longest streak of consecutive active days: 2"));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("unusableAiResults")
    public void writeReview_ShouldThrowAiUnavailableException_WhenAiResultIsUnusable(AiWeeklyReviewResult aiResult) {
        stubAiResult(aiResult);

        assertThrows(AiUnavailableException.class, () -> weeklyReviewAiWriter.writeReview(stats));
    }

    @Test
    public void writeReview_ShouldThrowAiUnavailableExceptionWithCause_WhenAiCallFails() {
        RuntimeException providerFailure = new RuntimeException("401 invalid x-api-key");
        when(chatClientProvider.getIfAvailable()).thenReturn(chatClient);
        when(chatClient.prompt()
                .system(anyString())
                .user(anyString())
                .call()
                .entity(AiWeeklyReviewResult.class)
        ).thenThrow(providerFailure);

        AiUnavailableException exception = assertThrows(AiUnavailableException.class,
                () -> weeklyReviewAiWriter.writeReview(stats));

        assertEquals(providerFailure, exception.getCause());
        assertFalse(exception.getMessage().contains("x-api-key"));
    }

    private static Stream<Arguments> unusableAiResults() {
        return Stream.of(
                arguments(named("no result", null)),
                arguments(named("null summary", new AiWeeklyReviewResult(null, List.of(GOOD_NOTE)))),
                arguments(named("blank summary", new AiWeeklyReviewResult("  ", List.of(GOOD_NOTE)))),
                arguments(named("null notes", new AiWeeklyReviewResult("A steady week.", null))),
                arguments(named("empty notes", new AiWeeklyReviewResult("A steady week.", List.of()))),
                arguments(named("only unusable notes", new AiWeeklyReviewResult(
                        "A steady week.", List.of(new ReviewNoteDto("No type", null))
                ))),
                arguments(named("summary too long", new AiWeeklyReviewResult(
                        "x".repeat(2001), List.of(GOOD_NOTE)
                ))),
                arguments(named("more than 5 notes", new AiWeeklyReviewResult(
                        "A steady week.", List.of(GOOD_NOTE, GOOD_NOTE, GOOD_NOTE, IMPROVE_NOTE, IMPROVE_NOTE, IMPROVE_NOTE)
                )))
        );
    }

    private void stubAiResult(AiWeeklyReviewResult aiResult) {
        when(chatClientProvider.getIfAvailable()).thenReturn(chatClient);
        when(chatClient.prompt()
                .system(anyString())
                .user(anyString())
                .call()
                .entity(AiWeeklyReviewResult.class)
        ).thenReturn(aiResult);
    }
}

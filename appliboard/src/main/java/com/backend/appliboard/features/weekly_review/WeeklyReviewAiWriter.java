package com.backend.appliboard.features.weekly_review;

import com.backend.appliboard.features.weekly_review.dto.AiWeeklyReviewResult;
import com.backend.appliboard.features.weekly_review.dto.ReviewNoteDto;
import com.backend.appliboard.infrastructures.config.AiConfig;
import com.backend.appliboard.shared.exceptions.AiUnavailableException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Turns computed weekly consistency stats into a written review using the AI model.
 * The AI only writes text; every number comes from {@link WeeklyConsistencyStats}.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WeeklyReviewAiWriter {

    private static final String WEEKLY_REVIEW_PROMPT = loadWeeklyReviewPrompt();
    private static final String AI_CALL_FAILED_MESSAGE =
            "The AI couldn't write your weekly review right now. Please try again later.";
    private static final String INVALID_REVIEW_MESSAGE =
            "The AI returned an incomplete weekly review. Please try again.";

    /** Optional until an AI API key is configured; see {@link AiConfig}. */
    private final ObjectProvider<ChatClient> chatClientProvider;
    private final Validator validator;

    private static String loadWeeklyReviewPrompt() {
        try {
            return new ClassPathResource("prompts/weeklyReviewPrompt.txt")
                    .getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException exception) {
            throw new UncheckedIOException("Failed to load the weekly review prompt", exception);
        }
    }

    /**
     * @param stats the analyzed week's consistency numbers
     * @return the AI summary and notes, with invalid notes removed
     * @throws AiUnavailableException if AI is not configured, the AI call fails, or the AI's answer
     *                                breaks the rules on {@link AiWeeklyReviewResult}
     */
    public AiWeeklyReviewResult writeReview(WeeklyConsistencyStats stats) {
        ChatClient chatClient = AiConfig.requireChatClient(chatClientProvider);
        return requireUsableResult(requestReview(chatClient, stats));
    }

    /** Wraps any provider or parsing failure so the client gets a safe message, not internals. */
    private AiWeeklyReviewResult requestReview(ChatClient chatClient, WeeklyConsistencyStats stats) {
        try {
            return chatClient.prompt()
                    .system(WEEKLY_REVIEW_PROMPT)
                    .user(buildStatsMessage(stats))
                    .call()
                    .entity(AiWeeklyReviewResult.class);
        } catch (RuntimeException exception) {
            log.error("The weekly review AI call failed", exception);
            throw new AiUnavailableException(AI_CALL_FAILED_MESSAGE, exception);
        }
    }

    private String buildStatsMessage(WeeklyConsistencyStats stats) {
        return """
        Review my application consistency for last week (Sunday to Saturday).

        Applications per day:
        %s

        Total applications: %d
        Total applications the week before: %d
        Active days (at least one application): %d of 7
        Longest streak of consecutive active days: %d
        """.formatted(
                formatCountByDay(stats),
                stats.totalApplications(),
                stats.previousWeekTotal(),
                stats.activeDays(),
                stats.longestStreak()
        );
    }

    private String formatCountByDay(WeeklyConsistencyStats stats) {
        return WeeklyConsistencyStats.WEEK_ORDER.stream()
                .map(day -> "- %s: %d".formatted(dayName(day), stats.countByDay().getOrDefault(day, 0L)))
                .collect(Collectors.joining("\n"));
    }

    private String dayName(DayOfWeek day) {
        return day.getDisplayName(TextStyle.FULL, Locale.ENGLISH);
    }

    /** Drops invalid notes, then checks the whole answer against the DTO's validation rules. */
    private AiWeeklyReviewResult requireUsableResult(AiWeeklyReviewResult result) {
        if (result == null) {
            throw new AiUnavailableException(INVALID_REVIEW_MESSAGE);
        }

        AiWeeklyReviewResult cleanedResult = new AiWeeklyReviewResult(
                trimSummary(result.summary()),
                keepValidNotes(result.notes())
        );
        requireValid(cleanedResult);

        return cleanedResult;
    }

    private String trimSummary(String summary) {
        return summary == null ? null : summary.trim();
    }

    private List<ReviewNoteDto> keepValidNotes(List<ReviewNoteDto> notes) {
        if (notes == null) {
            return List.of();
        }

        return notes.stream().filter(this::isValidNote).toList();
    }

    private boolean isValidNote(ReviewNoteDto note) {
        return note != null && validator.validate(note).isEmpty();
    }

    private void requireValid(AiWeeklyReviewResult result) {
        Set<ConstraintViolation<AiWeeklyReviewResult>> violations = validator.validate(result);
        if (violations.isEmpty()) {
            return;
        }

        log.warn("The AI returned an invalid weekly review: {}", describeViolations(violations));
        throw new AiUnavailableException(INVALID_REVIEW_MESSAGE);
    }

    private String describeViolations(Set<ConstraintViolation<AiWeeklyReviewResult>> violations) {
        return violations.stream()
                .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                .sorted()
                .collect(Collectors.joining(", "));
    }
}

package com.backend.appliboard.features.weekly_review;

import com.backend.appliboard.features.weekly_review.dto.AiWeeklyReviewResult;
import com.backend.appliboard.features.weekly_review.dto.ReviewNoteDto;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Turns computed weekly consistency stats into a written review using the AI model.
 * The AI only writes text; every number comes from {@link WeeklyConsistencyStats}.
 */
@Component
@RequiredArgsConstructor
public class WeeklyReviewAiWriter {

    private static final String WEEKLY_REVIEW_PROMPT = loadWeeklyReviewPrompt();

    private final ChatClient chatClient;

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
     * @return the AI summary and notes, with empty or untyped notes removed
     * @throws IllegalStateException if the AI returns no summary or no usable notes
     */
    public AiWeeklyReviewResult writeReview(WeeklyConsistencyStats stats) {
        AiWeeklyReviewResult result = chatClient.prompt()
                .system(WEEKLY_REVIEW_PROMPT)
                .user(buildStatsMessage(stats))
                .call()
                .entity(AiWeeklyReviewResult.class);

        return requireUsableResult(result);
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

    private AiWeeklyReviewResult requireUsableResult(AiWeeklyReviewResult result) {
        if (result == null || result.summary() == null || result.summary().isBlank()) {
            throw new IllegalStateException("The AI returned an empty weekly review");
        }

        List<ReviewNoteDto> usableNotes = result.notes() == null
                ? List.of()
                : result.notes().stream().filter(this::isUsableNote).toList();

        if (usableNotes.isEmpty()) {
            throw new IllegalStateException("The AI returned a weekly review without notes");
        }

        return new AiWeeklyReviewResult(result.summary().trim(), usableNotes);
    }

    private boolean isUsableNote(ReviewNoteDto note) {
        return note != null && note.type() != null && note.content() != null && !note.content().isBlank();
    }
}

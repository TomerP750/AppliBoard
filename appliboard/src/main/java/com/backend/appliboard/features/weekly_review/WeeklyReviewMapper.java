package com.backend.appliboard.features.weekly_review;

import com.backend.appliboard.features.weekly_review.dto.ReviewNoteDto;
import com.backend.appliboard.features.weekly_review.dto.WeeklyReviewDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class WeeklyReviewMapper {

    public static WeeklyReviewDto toDto(WeeklyReview entity) {
        return new WeeklyReviewDto(
                entity.getId(),
                entity.getWeekStart(),
                entity.getWeekEnd(),
                entity.getSummary(),
                entity.getTrend(),
                toNoteDtos(entity.getNotes()),
                entity.getTotalApplications(),
                entity.getActiveDays(),
                entity.getLongestStreak(),
                entity.getCreatedAt()
        );
    }

    /** Returns a mutable list, because Hibernate replaces it with its own collection when saving. */
    public static List<ReviewNote> toNotes(List<ReviewNoteDto> noteDtos) {
        return noteDtos.stream()
                .map(note -> new ReviewNote(note.content(), note.type()))
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private static List<ReviewNoteDto> toNoteDtos(List<ReviewNote> notes) {
        return notes.stream()
                .map(note -> new ReviewNoteDto(note.getContent(), note.getType()))
                .toList();
    }
}

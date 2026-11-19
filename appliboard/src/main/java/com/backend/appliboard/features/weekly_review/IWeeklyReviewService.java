package com.backend.appliboard.features.weekly_review;

import com.backend.appliboard.features.weekly_review.dto.WeeklyReviewDto;
import com.backend.appliboard.features.weekly_review.dto.WeeklyReviewStatusDto;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IWeeklyReviewService {

    /**
     * Returns the review for the current window (Sunday 08:00 to the next Sunday 08:00), if any,
     * and whether a new one can be generated.
     *
     * @param userId the authenticated user
     * @return the current review (or {@code null}), the week a new review would analyze,
     *         and when the next window opens
     */
    WeeklyReviewStatusDto getCurrentReview(UUID userId);

    /**
     * Computes last week's consistency stats, asks the AI to review them and saves the result.
     * Allowed once per user per review window.
     *
     * @param userId the authenticated user
     * @return the saved review
     * @throws FoundException    if the user already generated a review in the current window
     * @throws NotFoundException if the user does not exist
     */
    WeeklyReviewDto generateReview(UUID userId) throws FoundException, NotFoundException;

    /**
     * @param userId   the authenticated user
     * @param pageable page and size
     * @return the user's past reviews, newest week first
     */
    Page<WeeklyReviewDto> getHistory(UUID userId, Pageable pageable);
}

package com.backend.appliboard.features.weekly_review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface WeeklyReviewRepository extends JpaRepository<WeeklyReview, UUID> {

    boolean existsByUserIdAndWindowStart(UUID userId, Instant windowStart);

    Optional<WeeklyReview> findByUserIdAndWindowStart(UUID userId, Instant windowStart);

    Page<WeeklyReview> findByUserIdOrderByWeekStartDesc(UUID userId, Pageable pageable);
}

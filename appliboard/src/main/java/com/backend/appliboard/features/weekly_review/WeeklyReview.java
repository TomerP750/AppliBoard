package com.backend.appliboard.features.weekly_review;

import com.backend.appliboard.features.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * An AI review of one user's application consistency for one week.
 * The unique index on (user, windowStart) allows only one review per user per review window.
 */
@Entity
@Table(name = "weekly_reviews",
        indexes = @Index(name = "uk_weekly_review_user_window",
                columnList = "user_id, windowStart",
                unique = true))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class WeeklyReview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToOne(optional = false)
    private User user;

    /** Start of the review window (a Sunday 08:00) this review was generated in. */
    @Column(nullable = false)
    private Instant windowStart;

    /** Start of the analyzed week (inclusive). */
    @Column(nullable = false)
    private Instant weekStart;

    /** End of the analyzed week (exclusive). */
    @Column(nullable = false)
    private Instant weekEnd;

    @Column(nullable = false, length = 2000)
    private String summary;

    @Enumerated(EnumType.STRING)
    private ReviewTrend trend;

    private long totalApplications;

    private int activeDays;

    private int longestStreak;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "weekly_review_notes", joinColumns = @JoinColumn(name = "weekly_review_id"))
    @OrderColumn(name = "note_order")
    @Builder.Default
    private List<ReviewNote> notes = new ArrayList<>();

    @CreatedDate
    private Instant createdAt;
}

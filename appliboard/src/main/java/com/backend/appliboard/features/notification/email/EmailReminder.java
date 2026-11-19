package com.backend.appliboard.features.notification.email;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Record of a stale-application reminder email that was sent.
 * <p>
 * Lets the email consumer deduplicate on its own, independent of the in-app notification:
 * an application is emailed at most once per stale period (i.e. once after each update).
 */
@Entity
@Table(name = "email_reminders",
        indexes = @Index(name = "idx_email_reminder_jobapp_sent",
                columnList = "jobApplicationId, sentAt"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailReminder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID jobApplicationId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private Instant sentAt;
}

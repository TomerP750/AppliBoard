package com.backend.appliboard.features.notification.email;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.UUID;

public interface EmailReminderRepository extends JpaRepository<EmailReminder, UUID> {

    /**
     * @return true if a reminder email for this application was already sent at or after {@code since}
     * (typically the application's last update time)
     */
    boolean existsByJobApplicationIdAndSentAtGreaterThanEqual(UUID jobApplicationId, Instant since);
}

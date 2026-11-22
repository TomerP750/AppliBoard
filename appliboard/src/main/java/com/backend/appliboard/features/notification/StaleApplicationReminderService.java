package com.backend.appliboard.features.notification;

import com.backend.appliboard.features.job_application.JobApplicationRepository;
import com.backend.appliboard.features.job_application.Status;
import com.backend.appliboard.features.job_application.dto.StaleApplication;
import com.backend.appliboard.features.notification.email.StaleApplicationEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

/**
 * Daily job that reminds users about job applications they haven't updated for {@link #STALE_AFTER}:
 * a mock reminder email plus an in-app {@link Notification}.
 * <p>
 * Duplicates are prevented by the query: an application is skipped once a notification
 * exists for it since its last update.
 *
 * @see JobApplicationRepository#findStaleWithoutNotification(Instant, List)
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class StaleApplicationReminderService {

    /** How long an application can go without updates before it counts as stale. */
    private static final Duration STALE_AFTER = Duration.ofDays(14);

    /** Statuses that still need follow-up; finished applications (rejected/accepted) are ignored. */
    private static final List<Status> ACTIVE_STATUSES =
            List.of(Status.PENDING, Status.IN_PROGRESS, Status.INTERVIEW_SCHEDULED);

    private final JobApplicationRepository jobApplicationRepository;
    private final INotificationService notificationService;
    private final StaleApplicationEmailService staleApplicationEmailService;

    /**
     * Runs every day at 09:00 (server time) and reminds the user about each stale, active
     * application that hasn't been notified yet.
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void sendStaleApplicationReminders() {
        Instant cutoff = Instant.now().minus(STALE_AFTER);
        List<StaleApplication> staleApplications =
                jobApplicationRepository.findStaleWithoutNotification(cutoff, ACTIVE_STATUSES);

        log.info("Found {} stale applications to remind", staleApplications.size());

        staleApplications.forEach(this::remind);
    }

    /**
     * Emails first, then creates the notification. The notification marks the application as done,
     * so if anything fails it is picked up again on the next run (the email is not sent twice).
     * A failure is logged and doesn't stop the other applications from being reminded.
     */
    private void remind(StaleApplication staleApplication) {
        try {
            staleApplicationEmailService.sendReminder(staleApplication);
            notificationService.createNotification(staleApplication);
        } catch (Exception e) {
            log.error("Failed to remind about stale application {}", staleApplication.jobApplicationId(), e);
        }
    }
}

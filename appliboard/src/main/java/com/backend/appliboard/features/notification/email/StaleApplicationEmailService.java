package com.backend.appliboard.features.notification.email;

import com.backend.appliboard.features.job_application.dto.StaleApplication;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserService;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Emails the user a reminder for a stale job application, at most once per stale period.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class StaleApplicationEmailService {

    private final EmailSender emailSender;
    private final UserService userService;
    private final EmailReminderRepository emailReminderRepository;

    /**
     * Sends the reminder email unless one was already sent since the application's last update.
     * <p>
     * The application is picked up again on the next run until its in-app notification exists,
     * so this check keeps the user from getting the same email twice.
     * The record is saved <i>before</i> sending, in one transaction: if sending throws,
     * the record is rolled back and the next run tries again.
     *
     * @param staleApplication the application to remind the user about
     * @throws NotFoundException if the user no longer exists
     */
    @Transactional
    public void sendReminder(StaleApplication staleApplication) throws NotFoundException {
        if (isReminderAlreadySent(staleApplication)) {
            log.info("Reminder email already sent for application {}, skipping", staleApplication.jobApplicationId());
            return;
        }

        User user = userService.fetchUserEntity(staleApplication.userId());
        saveReminderRecord(staleApplication);
        emailSender.send(user.getEmail(), buildSubject(staleApplication), buildBody(user, staleApplication));
    }

    private boolean isReminderAlreadySent(StaleApplication staleApplication) {
        return emailReminderRepository.existsByJobApplicationIdAndSentAtGreaterThanEqual(
                staleApplication.jobApplicationId(), staleApplication.lastUpdatedAt());
    }

    private void saveReminderRecord(StaleApplication staleApplication) {
        emailReminderRepository.save(EmailReminder.builder()
                .jobApplicationId(staleApplication.jobApplicationId())
                .userId(staleApplication.userId())
                .sentAt(Instant.now())
                .build());
    }

    private String buildSubject(StaleApplication staleApplication) {
        return "Time to follow up on " + staleApplication.jobApplicationName();
    }

    private String buildBody(User user, StaleApplication staleApplication) {
        return """
                Hi %s,

                You haven't updated your application to %s in over 14 days.
                It might be a good time to follow up or update its status in AppliBoard.

                Good luck!
                The AppliBoard team""".formatted(user.getFirstName(), staleApplication.jobApplicationName());
    }
}

package com.backend.appliboard.features.notification.email;

import com.backend.appliboard.features.notification.event.StaleApplicationEvent;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserService;
import com.backend.appliboard.infrastructures.config.ConditionalOnKafkaEnabled;
import com.backend.appliboard.infrastructures.config.KafkaTopicConfig;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Second consumer of {@link KafkaTopicConfig#STALE_APPLICATION_TOPIC}: emails the user a
 * reminder for each stale application.
 * <p>
 * It uses its own consumer group ({@value #GROUP_ID}), separate from the in-app notification
 * consumer. Consumers in different groups each receive <b>every</b> event, so one event
 * produces both an in-app notification and an email. (Consumers in the same group would
 * split the events between them instead.)
 * <p>
 * Failures follow the shared error handling: retries, then the dead letter topic.
 *
 * @see com.backend.appliboard.features.notification.StaleApplicationEventConsumer the in-app consumer
 */
@Component
@ConditionalOnKafkaEnabled
@Slf4j
@RequiredArgsConstructor
public class StaleApplicationEmailConsumer {

    static final String GROUP_ID = "appliboard-email";

    private final EmailSender emailSender;
    private final UserService userService;
    private final EmailReminderRepository emailReminderRepository;

    /**
     * Builds and sends the reminder email for one stale application, unless one was already
     * sent since the application's last update.
     * <p>
     * The producer keeps republishing an application until an in-app notification exists for it,
     * so if the notification consumer fails, the same event arrives again the next day. This check
     * makes the email consumer dedupe on its own, so the user still gets only one email.
     * <p>
     * The record is saved <i>before</i> sending, inside one transaction: if sending throws,
     * the record is rolled back and the retry/DLT can try again.
     * <p>
     * {@code auto.offset.reset=latest} overrides the global {@code earliest} for this listener only.
     * It applies only when the group has no committed offset (first start, or offsets expired):
     * the consumer then starts at new events instead of emailing every event still retained
     * in the topic in one burst. After that, it continues from its committed offset as usual.
     *
     * @param event the stale application received from Kafka
     * @throws NotFoundException if the user no longer exists
     */
    @KafkaListener(topics = KafkaTopicConfig.STALE_APPLICATION_TOPIC, groupId = GROUP_ID,
            properties = "auto.offset.reset=latest")
    @Transactional
    public void onStaleApplication(StaleApplicationEvent event) throws NotFoundException {
        if (emailReminderRepository.existsByJobApplicationIdAndSentAtGreaterThanEqual(
                event.jobApplicationId(), event.lastUpdatedAt())) {
            log.info("Reminder email already sent for application {}, skipping", event.jobApplicationId());
            return;
        }

        log.info("Sending stale reminder email for application {}", event.jobApplicationId());

        User user = userService.fetchUserEntity(event.userId());

        emailReminderRepository.save(EmailReminder.builder()
                .jobApplicationId(event.jobApplicationId())
                .userId(event.userId())
                .sentAt(Instant.now())
                .build());

        String subject = "Time to follow up on " + event.jobApplicationName();
        String body = """
                Hi %s,

                You haven't updated your application to %s in over 14 days.
                It might be a good time to follow up or update its status in AppliBoard.

                Good luck!
                The AppliBoard team""".formatted(user.getFirstName(), event.jobApplicationName());

        emailSender.send(user.getEmail(), subject, body);
    }
}

package com.backend.appliboard.features.notification;

import com.backend.appliboard.features.notification.event.StaleApplicationEvent;
import com.backend.appliboard.infrastructures.config.ConditionalOnKafkaEnabled;
import com.backend.appliboard.infrastructures.config.KafkaTopicConfig;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumer side of the stale-application reminder flow.
 * <p>
 * Reads {@link StaleApplicationEvent}s from {@link KafkaTopicConfig#STALE_APPLICATION_TOPIC}
 * and stores each one as an in-app {@link Notification}, which the frontend bell reads.
 * <p>
 * Uses the default consumer group from {@code spring.kafka.consumer.group-id}
 * ({@code appliboard-notifications}). Other consumers of the same topic (e.g. email)
 * must use their own group so they also receive every event.
 *
 * @see StaleApplicationReminderService the producer
 */
@Component
@ConditionalOnKafkaEnabled
@Slf4j
@RequiredArgsConstructor
public class StaleApplicationEventConsumer {

    private final INotificationService notificationService;

    /**
     * Creates a notification for one stale application.
     * If it throws, Spring Kafka's default error handler retries the message before skipping it.
     *
     * @param event the stale application received from Kafka
     * @throws NotFoundException if the user no longer exists
     */
    @KafkaListener(topics = KafkaTopicConfig.STALE_APPLICATION_TOPIC)
    public void onStaleApplication(StaleApplicationEvent event) throws NotFoundException {
        log.info("Received stale event for application {}", event.jobApplicationId());
        notificationService.createNotification(event);
    }
}

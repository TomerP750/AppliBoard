package com.backend.appliboard.features.notification;

import com.backend.appliboard.features.job_application.JobApplicationRepository;
import com.backend.appliboard.features.job_application.Status;
import com.backend.appliboard.features.notification.event.StaleApplicationEvent;
import com.backend.appliboard.infrastructures.config.ConditionalOnKafkaEnabled;
import com.backend.appliboard.infrastructures.config.KafkaTopicConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

/**
 * Producer side of the stale-application reminder flow.
 * <p>
 * Once a day it finds job applications the user hasn't updated for {@link #STALE_AFTER}
 * and publishes a {@link StaleApplicationEvent} for each one to the
 * {@link KafkaTopicConfig#STALE_APPLICATION_TOPIC} topic. It does not create notifications
 * itself; a Kafka consumer turns each event into a {@link Notification}.
 * <p>
 * Duplicates are prevented by the query: an application is skipped if a notification
 * was already created for it after its last update.
 *
 * @see JobApplicationRepository#findStaleWithoutNotification(Instant, List)
 */
@Service
@ConditionalOnKafkaEnabled
@Slf4j
@RequiredArgsConstructor
public class StaleApplicationReminderService {

    /** How long an application can go without updates before it counts as stale. */
    private static final Duration STALE_AFTER = Duration.ofDays(14);

    /** Statuses that still need follow-up; finished applications (rejected/accepted) are ignored. */
    private static final List<Status> ACTIVE_STATUSES =
            List.of(Status.PENDING, Status.IN_PROGRESS, Status.INTERVIEW_SCHEDULED);

    private final JobApplicationRepository jobApplicationRepository;
    private final KafkaTemplate<String, StaleApplicationEvent> kafkaTemplate;

    /**
     * Runs every day at 09:00 (server time). Finds stale, active applications that haven't
     * been notified yet and publishes one event per application.
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void createReminderNotificationForStaleApplications() {
        Instant cutoff = Instant.now().minus(STALE_AFTER);

        List<StaleApplicationEvent> events =
                jobApplicationRepository.findStaleWithoutNotification(cutoff, ACTIVE_STATUSES);

        log.info("Found {} stale applications to notify", events.size());

        events.forEach(this::publish);
    }

    /**
     * Sends one event to Kafka without blocking. The message key is the user id, so all
     * events of the same user land on the same partition and keep their order.
     * A failed send is only logged; the application is picked up again on the next run,
     * because no notification was created for it.
     *
     * @param event the stale application to publish
     */
    private void publish(StaleApplicationEvent event) {
        kafkaTemplate.send(KafkaTopicConfig.STALE_APPLICATION_TOPIC, event.userId().toString(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to publish stale event for application {}", event.jobApplicationId(), ex);
                    }
                });
    }
}

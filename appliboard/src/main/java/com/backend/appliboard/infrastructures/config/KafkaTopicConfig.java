package com.backend.appliboard.infrastructures.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    public static final String STALE_APPLICATION_TOPIC = "stale-application-events";

    /** Suffix for dead letter topics: messages that failed processing are moved to {@code <topic>.DLT}. */
    public static final String DLT_SUFFIX = ".DLT";

    public static final String STALE_APPLICATION_DLT = STALE_APPLICATION_TOPIC + DLT_SUFFIX;

    /** Partitions of the main topic; its DLT must have the same count (failed records keep their partition). */
    private static final int STALE_APPLICATION_PARTITIONS = 3;

    /**
     * Created on startup by Spring's KafkaAdmin if it doesn't exist yet.
     * replicas = 1 because the local setup has a single broker.
     */
    @Bean
    public NewTopic staleApplicationTopic() {
        return TopicBuilder.name(STALE_APPLICATION_TOPIC)
                .partitions(STALE_APPLICATION_PARTITIONS)
                .replicas(1)
                .build();
    }

    /**
     * Dead letter topic for {@link #STALE_APPLICATION_TOPIC}. Messages that can't be deserialized,
     * or whose processing still fails after retries, are parked here instead of being lost.
     */
    @Bean
    public NewTopic staleApplicationDeadLetterTopic() {
        return TopicBuilder.name(STALE_APPLICATION_DLT)
                .partitions(STALE_APPLICATION_PARTITIONS)
                .replicas(1)
                .build();
    }
}

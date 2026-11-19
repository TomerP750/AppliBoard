package com.backend.appliboard.infrastructures.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    public static final String STALE_APPLICATION_TOPIC = "stale-application-events";

    /**
     * Created on startup by Spring's KafkaAdmin if it doesn't exist yet.
     * replicas = 1 because the local setup has a single broker.
     */
    @Bean
    public NewTopic staleApplicationTopic() {
        return TopicBuilder.name(STALE_APPLICATION_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}

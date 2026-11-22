package com.backend.appliboard.infrastructures.config;

import com.backend.appliboard.shared.exceptions.NotFoundException;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.ByteArraySerializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaOperations;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Error handling for all {@code @KafkaListener}s.
 * <p>
 * A failed message is retried {@value #RETRY_ATTEMPTS} more times, {@value #RETRY_INTERVAL_MS} ms apart.
 * If it still fails, it is published to {@code <original topic>.DLT} on the same partition,
 * so it can be inspected or replayed later instead of being lost.
 * <p>
 * Spring Boot picks up the {@link DefaultErrorHandler} bean and applies it to the default
 * listener container factory automatically.
 */
@Configuration
@ConditionalOnKafkaEnabled
public class KafkaErrorHandlingConfig {

    private static final long RETRY_INTERVAL_MS = 1000L;
    private static final long RETRY_ATTEMPTS = 2L;

    @Bean
    public DefaultErrorHandler kafkaErrorHandler(KafkaOperations<?, ?> kafkaTemplate,
                                                 ProducerFactory<?, ?> producerFactory) {

        // Messages that failed deserialization reach the recoverer as raw bytes, so they need a
        // byte[] serializer; everything else goes through the regular JSON template.
        // LinkedHashMap: the most specific type must be checked first.
        Map<Class<?>, KafkaOperations<?, ?>> templates = new LinkedHashMap<>();
        templates.put(byte[].class, bytesTemplate(producerFactory));
        templates.put(Object.class, kafkaTemplate);

        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(templates,
                (record, ex) -> new TopicPartition(record.topic() + KafkaTopicConfig.DLT_SUFFIX, record.partition()));

        DefaultErrorHandler errorHandler =
                new DefaultErrorHandler(recoverer, new FixedBackOff(RETRY_INTERVAL_MS, RETRY_ATTEMPTS));

        // Retrying can't fix a missing user, so send it to the DLT right away.
        // (Deserialization errors are already treated as not retryable by default.)
        errorHandler.addNotRetryableExceptions(NotFoundException.class);

        return errorHandler;
    }

    /** Same producer settings as the main template, but writes values as raw bytes. */
    private KafkaTemplate<String, byte[]> bytesTemplate(ProducerFactory<?, ?> producerFactory) {
        return new KafkaTemplate<>(new DefaultKafkaProducerFactory<>(
                producerFactory.getConfigurationProperties(),
                new StringSerializer(),
                new ByteArraySerializer()));
    }
}

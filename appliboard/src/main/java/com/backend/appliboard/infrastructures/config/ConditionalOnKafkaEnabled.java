package com.backend.appliboard.infrastructures.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Creates the annotated bean only when Kafka is enabled ({@code appliboard.kafka.enabled}, default {@code true}).
 * <p>
 * With {@code appliboard.kafka.enabled=false} no topics are declared and no listeners or producers run,
 * so nothing connects to the broker and the app starts without Kafka. The stale-application
 * reminder flow (notifications and emails) is off while disabled.
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@ConditionalOnProperty(name = "appliboard.kafka.enabled", havingValue = "true", matchIfMissing = true)
public @interface ConditionalOnKafkaEnabled {
}

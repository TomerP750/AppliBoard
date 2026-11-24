package com.backend.appliboard.infrastructures.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.BatchStrategies;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.cache.RedisCacheWriter;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import tools.jackson.databind.jsontype.PolymorphicTypeValidator;

import java.time.Duration;
import java.util.Map;

/**
 * Redis cache setup.
 * Keys look like {@code appliboard::<cacheName>::<key>} and values are stored as JSON with type info,
 * so cached records are read back as their real type.
 */
@Configuration
@EnableCaching
public class RedisConfig {

    private static final String KEY_PREFIX = "appliboard::";
    private static final Duration DEFAULT_TTL = Duration.ofMinutes(10);
    private static final Duration JOB_APPLICATIONS_TTL = Duration.ofMinutes(5);
    private static final Duration JOB_APPLICATION_TTL = Duration.ofMinutes(10);
    private static final int SCAN_BATCH_SIZE = 1000;

    /**
     * Writes to Redis without locking. Pattern deletes use SCAN in batches instead of KEYS,
     * so clearing one user's entries doesn't block Redis.
     */
    @Bean
    public RedisCacheWriter redisCacheWriter(RedisConnectionFactory connectionFactory) {
        return RedisCacheWriter.nonLockingRedisCacheWriter(connectionFactory, BatchStrategies.scan(SCAN_BATCH_SIZE));
    }

    @Bean
    public RedisCacheManager cacheManager(RedisCacheWriter redisCacheWriter) {
        RedisCacheConfiguration defaults = defaultCacheConfiguration();

        return RedisCacheManager.builder(redisCacheWriter)
                .cacheDefaults(defaults)
                .withInitialCacheConfigurations(Map.of(
                        CacheNames.JOB_APPLICATIONS, defaults.entryTtl(JOB_APPLICATIONS_TTL),
                        CacheNames.JOB_APPLICATION, defaults.entryTtl(JOB_APPLICATION_TTL)
                ))
                .build();
    }

    private RedisCacheConfiguration defaultCacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(DEFAULT_TTL)
                .disableCachingNullValues()
                .computePrefixWith(cacheName -> KEY_PREFIX + cacheName + "::")
                .serializeKeysWith(SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(SerializationPair.fromSerializer(jsonValueSerializer()));
    }

    private GenericJacksonJsonRedisSerializer jsonValueSerializer() {
        return GenericJacksonJsonRedisSerializer.builder()
                .enableDefaultTyping(cachedTypesValidator())
                .build();
    }

    /**
     * Only our own classes and the JDK types they use (collections, UUID, Instant) may be
     * deserialized from the cache. This blocks gadget-class attacks through type info.
     */
    private PolymorphicTypeValidator cachedTypesValidator() {
        return BasicPolymorphicTypeValidator.builder()
                .allowIfSubType("com.backend.appliboard.")
                .allowIfSubType("java.util.")
                .allowIfSubType("java.time.")
                .build();
    }
}

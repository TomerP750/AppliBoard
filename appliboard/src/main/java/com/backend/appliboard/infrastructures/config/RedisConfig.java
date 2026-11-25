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

/**
 * Redis cache setup.
 * Keys look like {@code appliboard::<cacheName>::<key>} and values are stored as JSON with type info,
 * so cached records are read back as their real type.
 */
@Configuration
@EnableCaching
public class RedisConfig {

    private static final String KEY_PREFIX = "appliboard::";
    private static final Duration CACHE_TTL = Duration.ofMinutes(5);
    private static final int SCAN_BATCH_SIZE = 1000;

    /**
     * The cache writer deletes by pattern with SCAN in batches instead of the default KEYS, so clearing
     * one user's entries never blocks Redis.
     * {@code transactionAware()} runs cache puts and evictions after the DB transaction commits, so a
     * rolled-back write leaves the cache as it was.
     */
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheWriter scanningCacheWriter =
                RedisCacheWriter.nonLockingRedisCacheWriter(connectionFactory, BatchStrategies.scan(SCAN_BATCH_SIZE));

        return RedisCacheManager.builder(scanningCacheWriter)
                .cacheDefaults(cacheConfiguration())
                .transactionAware()
                .build();
    }

    private RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(CACHE_TTL)
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

package com.backend.appliboard.infrastructures.config;

/**
 * Names of the Redis caches. Use these constants in {@code @Cacheable}/{@code @CacheEvict}
 * instead of string literals.
 */
public final class CacheNames {

    /** Pages of a user's job applications, one entry per filter/sort/page (key: userId:filters:pageable). */
    public static final String JOB_APPLICATIONS = "jobApplications";
    public static final String ANALYTICS = "analytics";

    private CacheNames() {
    }
}

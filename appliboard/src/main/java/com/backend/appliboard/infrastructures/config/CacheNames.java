package com.backend.appliboard.infrastructures.config;

/**
 * Names of the Redis caches. Use these constants in {@code @Cacheable}/{@code @CacheEvict}
 * instead of string literals.
 */
public final class CacheNames {

    /** Pages of a user's job applications (list endpoint). */
    public static final String JOB_APPLICATIONS = "jobApplications";

    /** A single job application. */
    public static final String JOB_APPLICATION = "jobApplication";

    private CacheNames() {
    }
}

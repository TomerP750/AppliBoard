package com.backend.appliboard.features.job_application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    Page<JobApplication> findByUserId(UUID userId, Pageable pageable);

    Long countByUserId(UUID userId);

    Long countByUserIdAndAppliedAtGreaterThanEqualAndAppliedAtLessThan(
            UUID userId,
            Instant startOfWeek,
            Instant startOfNextWeek
    );

    @Query("""
            SELECT j.status AS status, COUNT(j) AS count
            FROM JobApplication j
            WHERE j.user.id = :userId
            GROUP BY j.status
            """)
    List<StatusCount> countByStatusForUser(@Param("userId") UUID userId);

    interface StatusCount {
        Status getStatus();

        Long getCount();
    }
}

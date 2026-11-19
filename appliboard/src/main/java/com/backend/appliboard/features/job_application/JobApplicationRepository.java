package com.backend.appliboard.features.job_application;

import com.backend.appliboard.features.notification.event.StaleApplicationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID>, JpaSpecificationExecutor<JobApplication> {

    Long countByUserId(UUID userId);

    Long countByUserIdAndAppliedAtGreaterThanEqualAndAppliedAtLessThan(
            UUID userId,
            Instant startOfWeek,
            Instant startOfNextWeek
    );

    Long countByUserIdAndAppliedAtGreaterThanEqualAndAppliedAtLessThanAndStatusNot(
            UUID userId,
            Instant startOfMonth,
            Instant startOfNextMonth,
            Status pendingStatus
    );

    /**
     * Applications not updated since {@code cutoff}, in one of {@code activeStatuses},
     * that have no notification created since their last update (prevents daily duplicates).
     * Selects only the fields the event needs (no entity loading, no join to users).
     */
    @Query("""
            SELECT new com.backend.appliboard.features.notification.event.StaleApplicationEvent(
                       j.user.id, j.id, j.name, j.updatedAt)
            FROM JobApplication j
            WHERE j.updatedAt < :cutoff
              AND j.status IN :activeStatuses
              AND NOT EXISTS (
                  SELECT n FROM Notification n
                  WHERE n.jobApplicationId = j.id
                    AND n.createdAt >= j.updatedAt
              )
            """)
    List<StaleApplicationEvent> findStaleWithoutNotification(
            @Param("cutoff") Instant cutoff,
            @Param("activeStatuses") List<Status> activeStatuses
    );

    @Query("""
            SELECT j.status AS status, COUNT(j) AS count
            FROM JobApplication j
            WHERE j.user.id = :userId
            GROUP BY j.status
            """)
    List<StatusCount> countByStatusForUser(@Param("userId") UUID userId);

    @Query("""
            SELECT FUNCTION('DAYOFWEEK', j.appliedAt) AS dayOfWeek, COUNT(j) AS count
            FROM JobApplication j
            WHERE j.user.id = :userId
            AND j.appliedAt >= :startOfWeek
            AND j.appliedAt < :startOfNextWeek
            GROUP BY FUNCTION('DAYOFWEEK', j.appliedAt)
            """)
    List<DayCount> countByDayForCurrentWeek(
            @Param("userId") UUID userId,
            @Param("startOfWeek") Instant startOfWeek,
            @Param("startOfNextWeek") Instant startOfNextWeek
    );

    @Query("""
            SELECT FUNCTION('DAYOFMONTH', j.appliedAt) AS dayOfMonth, COUNT(j) AS count
            FROM JobApplication j
            WHERE j.user.id = :userId
            AND j.appliedAt >= :startOfMonth
            AND j.appliedAt < :startOfNextMonth
            AND j.status <> :pendingStatus
            GROUP BY FUNCTION('DAYOFMONTH', j.appliedAt)
            """)
    List<DayOfMonthCount> countResponsesByDayForCurrentMonth(
            @Param("userId") UUID userId,
            @Param("startOfMonth") Instant startOfMonth,
            @Param("startOfNextMonth") Instant startOfNextMonth,
            @Param("pendingStatus") Status pendingStatus
    );

    interface StatusCount {
        Status getStatus();

        Long getCount();
    }

    interface DayCount {
        Integer getDayOfWeek();

        Long getCount();
    }

    interface DayOfMonthCount {
        Integer getDayOfMonth();

        Long getCount();
    }
}

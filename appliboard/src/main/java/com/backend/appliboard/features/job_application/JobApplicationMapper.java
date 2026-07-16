package com.backend.appliboard.features.job_application;

import com.backend.appliboard.features.job_application.dto.JobApplicationDto;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class JobApplicationMapper {

    public static JobApplicationDto toDto(JobApplication entity) {
        return new JobApplicationDto(
                entity.getId(),
                entity.getName(),
                entity.getCity(),
                entity.getStatus(),
                entity.getPosition(),
                entity.getIsFavorite(),
                entity.getNote(),
                entity.getAppliedAt(),
                isStale(entity)

        );
    }

    private static boolean isStale(JobApplication jobApplication) {
        return jobApplication.getUpdatedAt()
                .isBefore(Instant.now().minus(14, ChronoUnit.DAYS));
    }
}

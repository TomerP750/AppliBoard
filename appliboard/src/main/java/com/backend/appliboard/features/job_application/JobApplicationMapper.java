package com.backend.appliboard.features.job_application;

import com.backend.appliboard.features.job_application.dto.JobApplicationDto;
import org.springframework.stereotype.Component;

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
                entity.getAppliedAt()
        );
    }
}

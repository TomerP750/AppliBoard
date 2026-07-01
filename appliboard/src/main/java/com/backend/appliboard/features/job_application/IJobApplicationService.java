package com.backend.appliboard.features.job_application;

import com.backend.appliboard.features.job_application.dto.CreateJobApplicationDto;
import com.backend.appliboard.features.job_application.dto.JobApplicationDto;
import com.backend.appliboard.shared.NotFoundException;
import com.backend.appliboard.shared.UnauthorizedException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IJobApplicationService {

    Page<JobApplicationDto> allJobApplications(UUID userId, Pageable pageable);

    JobApplicationDto oneJobApplication(UUID userId, UUID jobApplicationId) throws NotFoundException;

    void createJobApplication(UUID userId, CreateJobApplicationDto dto) throws NotFoundException;

    void deleteJobApplication(UUID userId, UUID jobApplicationId) throws NotFoundException, UnauthorizedException;

    boolean toggleJobApplicationFavorite(UUID userId, UUID jobApplicationId) throws NotFoundException, UnauthorizedException;
}

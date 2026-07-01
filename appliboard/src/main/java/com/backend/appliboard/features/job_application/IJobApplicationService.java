package com.backend.appliboard.features.job_application;

import com.backend.appliboard.features.job_application.dto.CreateJobApplicationDto;
import com.backend.appliboard.features.job_application.dto.JobApplicationDto;
import com.backend.appliboard.features.job_application.dto.UpdateJobApplicationDto;
import com.backend.appliboard.shared.NotFoundException;
import com.backend.appliboard.shared.UnauthorizedException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IJobApplicationService {

    Page<JobApplicationDto> allJobApplications(UUID userId, Pageable pageable);

    JobApplicationDto oneJobApplication(UUID userId, UUID jobApplicationId) throws NotFoundException;

    /**
     * Creates a new job application for the specified user.
     *
     * @param userId the ID of the user creating the job application
     * @param dto the job application details to create
     * @throws NotFoundException if the user cannot be found
     */
    void createJobApplication(UUID userId, CreateJobApplicationDto dto) throws NotFoundException;

    /**
     * Updates an existing job application owned by the specified user.
     *
     * @param userId the ID of the user updating the job application
     * @param jobApplicationId the ID of the job application to update
     * @param dto the updated job application details
     * @throws NotFoundException if the user or job application cannot be found
     * @throws UnauthorizedException if the job application does not belong to the user
     */
    void updateJobApplication(UUID userId, UUID jobApplicationId, UpdateJobApplicationDto dto) throws NotFoundException, UnauthorizedException;

    /**
     * Deletes an existing job application owned by the specified user.
     *
     * @param userId the ID of the user deleting the job application
     * @param jobApplicationId the ID of the job application to delete
     * @throws NotFoundException if the user or job application cannot be found
     * @throws UnauthorizedException if the job application does not belong to the user
     */
    void deleteJobApplication(UUID userId, UUID jobApplicationId) throws NotFoundException, UnauthorizedException;

    /**
     * Toggles the favorite status of an existing job application owned by the specified user.
     *
     * @param userId the ID of the user toggling the favorite status
     * @param jobApplicationId the ID of the job application to toggle
     * @return the updated favorite status
     * @throws NotFoundException if the user or job application cannot be found
     * @throws UnauthorizedException if the job application does not belong to the user
     */
    boolean toggleJobApplicationFavorite(UUID userId, UUID jobApplicationId) throws NotFoundException, UnauthorizedException;
}

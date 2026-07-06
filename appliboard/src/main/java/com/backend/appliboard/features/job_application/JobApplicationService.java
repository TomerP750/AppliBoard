package com.backend.appliboard.features.job_application;

import com.backend.appliboard.features.activity.ActivityService;
import com.backend.appliboard.features.activity.ActivityType;
import com.backend.appliboard.features.job_application.dto.CreateJobApplicationDto;
import com.backend.appliboard.features.job_application.dto.JobApplicationFilterDto;
import com.backend.appliboard.features.job_application.dto.JobApplicationDto;
import com.backend.appliboard.features.job_application.dto.UpdateJobApplicationDto;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserService;
import com.backend.appliboard.shared.NotFoundException;
import com.backend.appliboard.shared.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class JobApplicationService implements IJobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserService userService;
    private final ActivityService activityService;


    @Override
    public Page<JobApplicationDto> allJobApplications(UUID userId, Pageable pageable) {

        log.info("Fetching Job Applications");

        Page<JobApplication> applications = jobApplicationRepository.findByUserId(userId, pageable);

        log.info("Fetched Job Applications");

        return applications.map(JobApplicationMapper::toDto);
    }

    @Override
    public Page<JobApplicationDto> searchJobApplications(UUID userId, JobApplicationFilterDto filters, Pageable pageable) {
        log.info("Searching Job Applications");

        Specification<JobApplication> specification = JobApplicationSpecifications.belongsToUser(userId)
                .and(JobApplicationSpecifications.nameContains(filters.name()))
                .and(JobApplicationSpecifications.hasStatuses(filters.statuses()))
                .and(JobApplicationSpecifications.hasPositions(filters.positions()))
                .and(JobApplicationSpecifications.hasFavorite(filters.isFavorite()));

        Page<JobApplication> filteredApplications = jobApplicationRepository.findAll(specification, pageable);

        log.info("Searched Job Applications");

        return filteredApplications.map(JobApplicationMapper::toDto);
    }

    @Override
    public JobApplicationDto oneJobApplication(UUID userId, UUID jobApplicationId) throws NotFoundException, UnauthorizedException {
        JobApplication jobApplication = fetchJobApplicationEntity(jobApplicationId);
        if (!userId.equals(jobApplication.getUser().getId())) {
            throw new UnauthorizedException("Cannot access this job application");
        }

        return JobApplicationMapper.toDto(jobApplication);
    }

    @Override
    @Transactional
    public void createJobApplication(UUID userId, CreateJobApplicationDto dto) throws NotFoundException {

        log.info("Creating Job Application");

        User user = userService.fetchUserEntity(userId);

        JobApplication jobApplication = JobApplication.builder()
                .name(dto.name())
                .status(dto.status())
                .city(dto.city())
                .isFavorite(false)
                .position(dto.position())
                .user(user)
                .build();

        jobApplicationRepository.save(jobApplication);

        log.info("Created Job Application");

        activityService.createActivity(user, jobApplication.getName(), ActivityType.CREATED);

    }

    @Override
    @Transactional
    public void updateJobApplication(UUID userId, UUID jobApplicationId, UpdateJobApplicationDto dto) throws NotFoundException, UnauthorizedException {

        log.info("Updating Job Application");

        JobApplication jobApplication = fetchJobApplicationEntity(jobApplicationId);
        if (!userId.equals(jobApplication.getUser().getId())) {
            throw new UnauthorizedException("Cannot update this job application");
        }

        if (dto.name() != null) {
            jobApplication.setName(dto.name());
        }
        if (dto.city() != null) {
            jobApplication.setCity(dto.city());
        }
        if (dto.status() != null) {
            jobApplication.setStatus(dto.status());
        }
        if (dto.position() != null) {
            jobApplication.setPosition(dto.position());
        }
        if (dto.isFavorite() != null) {
            jobApplication.setIsFavorite(dto.isFavorite());
        }

        jobApplicationRepository.save(jobApplication);

        log.info("Job application updated");

        User user = userService.fetchUserEntity(userId);
        activityService.createActivity(user, jobApplication.getName(), ActivityType.UPDATED);


    }

    @Override
    @Transactional
    public void deleteJobApplication(UUID userId, UUID jobApplicationId) throws NotFoundException, UnauthorizedException {

        log.info("Deleting Job Application");

        JobApplication jobApplication = fetchJobApplicationEntity(jobApplicationId);

        if (!userId.equals(jobApplication.getUser().getId())) {
            throw new UnauthorizedException("Cannot delete this job application");
        }

        jobApplicationRepository.deleteById(jobApplicationId);

        log.info("Deleted Job Application");

        User user = userService.fetchUserEntity(userId);
        activityService.createActivity(user, jobApplication.getName(), ActivityType.DELETED);

    }

    @Override
    @Transactional
    public boolean toggleJobApplicationFavorite(UUID userId, UUID jobApplicationId) throws NotFoundException, UnauthorizedException {

        log.info("Toggling Favorite");

        JobApplication jobApplication = fetchJobApplicationEntity(jobApplicationId);
        if (!userId.equals(jobApplication.getUser().getId())) {
            throw new UnauthorizedException("Cannot toggle favorite for this job application");
        }
        jobApplication.setIsFavorite(!jobApplication.getIsFavorite());
        jobApplicationRepository.save(jobApplication);

        log.info("Toggled");
        return jobApplication.getIsFavorite();
    }

    private JobApplication fetchJobApplicationEntity(UUID jobApplicationId) throws NotFoundException {
        return jobApplicationRepository.findById(jobApplicationId)
                .orElseThrow(() -> new NotFoundException("Not found"));
    }

}

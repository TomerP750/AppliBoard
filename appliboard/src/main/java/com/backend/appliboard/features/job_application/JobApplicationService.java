package com.backend.appliboard.features.job_application;

import com.backend.appliboard.features.job_application.dto.CreateJobApplicationDto;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class JobApplicationService implements IJobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserService userService;


    @Override
    public Page<JobApplicationDto> allJobApplications(UUID userId, Pageable pageable) {

        log.info("Fetching Job Applications");

        Page<JobApplication> applications = jobApplicationRepository.findByUserId(userId, pageable);

        log.info("Fetched Job Applications");

        return applications.map(JobApplicationMapper::toDto);
    }

    @Override
    public JobApplicationDto oneJobApplication(UUID userId, UUID jobApplicationId) throws NotFoundException {
        JobApplication jobApplication = fetchJobApplicationEntity(jobApplicationId);
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

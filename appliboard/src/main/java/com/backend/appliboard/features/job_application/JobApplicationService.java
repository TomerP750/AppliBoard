package com.backend.appliboard.features.job_application;

import com.backend.appliboard.features.job_application.dto.CreateJobApplicationDto;
import com.backend.appliboard.features.job_application.dto.JobApplicationDto;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserService;
import com.backend.appliboard.shared.NotFoundException;
import com.backend.appliboard.shared.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class JobApplicationService implements IJobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserService userService;


    @Override
    public Page<JobApplicationDto> allJobApplications(UUID userId, Pageable pageable) {
        Page<JobApplication> applications = jobApplicationRepository.findByUserId(userId, pageable);
        return applications.map(JobApplicationMapper::toDto);
    }

    @Override
    public JobApplicationDto oneJobApplication(UUID userId, UUID jobApplicationId) throws NotFoundException {
        JobApplication jobApplication = fetchJobApplicationEntity(jobApplicationId);
        return JobApplicationMapper.toDto(jobApplication);
    }

    @Override
    public void createJobApplication(UUID userId, CreateJobApplicationDto dto) throws NotFoundException {

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

    }

    @Override
    public void deleteJobApplication(UUID userId, UUID jobApplicationId) throws NotFoundException, UnauthorizedException {

        JobApplication jobApplication = fetchJobApplicationEntity(jobApplicationId);

        if (!userId.equals(jobApplication.getUser().getId())) {
            throw new UnauthorizedException("Cannot delete this job application");
        }

        jobApplicationRepository.deleteById(jobApplicationId);

    }

    @Override
    public boolean toggleJobApplicationFavorite(UUID userId, UUID jobApplicationId) throws NotFoundException, UnauthorizedException {
        JobApplication jobApplication = fetchJobApplicationEntity(jobApplicationId);
        if (!userId.equals(jobApplication.getUser().getId())) {
            throw new UnauthorizedException("Cannot toggle favorite for this job application");
        }
        jobApplication.setIsFavorite(!jobApplication.getIsFavorite());
        jobApplicationRepository.save(jobApplication);
        return jobApplication.getIsFavorite();
    }

    private JobApplication fetchJobApplicationEntity(UUID jobApplicationId) throws NotFoundException {
        return jobApplicationRepository.findById(jobApplicationId)
                .orElseThrow(() -> new NotFoundException("Not found"));
    }

}

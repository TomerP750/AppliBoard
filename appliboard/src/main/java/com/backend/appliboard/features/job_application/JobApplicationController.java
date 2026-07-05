package com.backend.appliboard.features.job_application;

import com.backend.appliboard.features.job_application.dto.CreateJobApplicationDto;
import com.backend.appliboard.features.job_application.dto.JobApplicationFilterDto;
import com.backend.appliboard.features.job_application.dto.JobApplicationDto;
import com.backend.appliboard.features.job_application.dto.UpdateJobApplicationDto;
import com.backend.appliboard.infrastructures.security.PrincipalUser;
import com.backend.appliboard.shared.NotFoundException;
import com.backend.appliboard.shared.UnauthorizedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ja")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;


    private Pageable createApplicationsPageable(int page, int size, String sort) {
        Sort.Direction direction = "oldest".equalsIgnoreCase(sort)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(direction, "appliedAt"));
    }

    @GetMapping("/all")
    public Page<JobApplicationDto> allJobApplications(@AuthenticationPrincipal PrincipalUser user,
                                                      @RequestParam(name = "page", defaultValue = "0") int page,
                                                      @RequestParam(name = "size", defaultValue = "10") int size) {

        Pageable pageable = createApplicationsPageable(page, size, "newest");
        UUID userId = user.getUserId();
        return jobApplicationService.allJobApplications(userId, pageable);
    }

    @GetMapping("/search")
    public Page<JobApplicationDto> searchJobApplications(@AuthenticationPrincipal PrincipalUser user,
                                                         @RequestParam(name = "name", required = false) String name,
                                                         @RequestParam(name = "statuses", required = false) List<Status> statuses,
                                                         @RequestParam(name = "positions", required = false) List<Position> positions,
                                                         @RequestParam(name = "favorites", required = false) Boolean favorites,
                                                         @RequestParam(name = "sort", defaultValue = "newest") String sort,
                                                         @RequestParam(name = "page", defaultValue = "0") int page,
                                                         @RequestParam(name = "size", defaultValue = "10") int size) {

        Pageable pageable = createApplicationsPageable(page, size, sort);
        JobApplicationFilterDto filters = new JobApplicationFilterDto(name, statuses, positions, favorites);

        UUID userId = user.getUserId();
        return jobApplicationService.searchJobApplications(userId, filters, pageable);
    }

    @GetMapping("/{jobApplicationId}")
    public JobApplicationDto oneJobApplication(@AuthenticationPrincipal PrincipalUser user, @PathVariable UUID jobApplicationId) throws NotFoundException, UnauthorizedException {
        UUID userId = user.getUserId();
        return jobApplicationService.oneJobApplication(userId, jobApplicationId);
    }

    @PostMapping("/create")
    public void createJobApplication(@AuthenticationPrincipal PrincipalUser user, @Valid @RequestBody CreateJobApplicationDto dto) throws NotFoundException {
        UUID userId = user.getUserId();
        jobApplicationService.createJobApplication(userId, dto);
    }

    @PutMapping("/update/{jobApplicationId}")
    public void updateJobApplication(@AuthenticationPrincipal PrincipalUser user,
                                     @PathVariable UUID jobApplicationId,
                                     @Valid @RequestBody UpdateJobApplicationDto dto) throws NotFoundException, UnauthorizedException {
        UUID userId = user.getUserId();
        jobApplicationService.updateJobApplication(userId, jobApplicationId, dto);
    }

    @DeleteMapping("/delete/{jobApplicationId}")
    public void deleteJobApplication(@AuthenticationPrincipal PrincipalUser user, @PathVariable UUID jobApplicationId) throws UnauthorizedException, NotFoundException {
        UUID userId = user.getUserId();
        jobApplicationService.deleteJobApplication(userId, jobApplicationId);
    }

    @PatchMapping("/toggle-favorite/{jobApplicationId}")
    public boolean toggleJobApplicationFavorite(@AuthenticationPrincipal PrincipalUser user, @PathVariable UUID jobApplicationId) throws NotFoundException, UnauthorizedException {
        UUID userId = user.getUserId();
        return jobApplicationService.toggleJobApplicationFavorite(userId, jobApplicationId);
    }


}

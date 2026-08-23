package com.backend.appliboard;

import com.backend.appliboard.features.activity.ActivityService;
import com.backend.appliboard.features.activity.ActivityType;
import com.backend.appliboard.features.job_application.JobApplication;
import com.backend.appliboard.features.job_application.JobApplicationRepository;
import com.backend.appliboard.features.job_application.JobApplicationService;
import com.backend.appliboard.features.job_application.Position;
import com.backend.appliboard.features.job_application.Status;
import com.backend.appliboard.features.job_application.dto.CreateJobApplicationDto;
import com.backend.appliboard.features.job_application.dto.JobApplicationDto;
import com.backend.appliboard.features.job_application.dto.JobApplicationFilterDto;
import com.backend.appliboard.features.job_application.dto.UpdateJobApplicationDto;
import com.backend.appliboard.features.user.Role;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserService;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import com.backend.appliboard.shared.exceptions.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Named.named;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JobApplicationServiceTest {

    private static final UUID USER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID OTHER_USER_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID JOB_APPLICATION_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final Instant APPLIED_AT = Instant.parse("2026-07-05T09:00:00Z");

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @Mock
    private UserService userService;

    @Mock
    private ActivityService activityService;

    @InjectMocks
    private JobApplicationService jobApplicationService;

    private final Pageable pageable = PageRequest.of(0, 10);

    private User user;
    private JobApplication jobApplication;

    @BeforeEach
    public void setUp() {
        user = User.builder()
                .id(USER_ID)
                .firstName("Test")
                .lastName("User")
                .email("test.user@example.com")
                .password("encoded-password")
                .avatarUrl("avatar-url")
                .role(Role.USER)
                .build();

        jobApplication = JobApplication.builder()
                .id(JOB_APPLICATION_ID)
                .name("AppliTest")
                .city("City1")
                .status(Status.PENDING)
                .position(Position.BACKEND)
                .isFavorite(false)
                .note("Initial note")
                .user(user)
                .appliedAt(APPLIED_AT)
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    public void allJobApplications_ShouldReturnMappedUserApplications_WhenFiltersAreEmpty() {
        when(jobApplicationRepository.findAll(
                ArgumentMatchers.<Specification<JobApplication>>any(),
                eq(pageable)
        )).thenReturn(pageOf(jobApplication));

        Page<JobApplicationDto> result = jobApplicationService.allJobApplications(USER_ID, emptyFilters(), pageable);

        assertEquals(1, result.getTotalElements());
        assertMatchesJobApplication(result.getContent().get(0));
    }

    @Test
    public void allJobApplications_ShouldReturnMappedApplications_WhenFiltersMatch() {
        JobApplicationFilterDto filters = new JobApplicationFilterDto(
                "appli",
                List.of(Status.PENDING),
                List.of(Position.BACKEND),
                false
        );
        when(jobApplicationRepository.findAll(
                ArgumentMatchers.<Specification<JobApplication>>any(),
                eq(pageable)
        )).thenReturn(pageOf(jobApplication));

        Page<JobApplicationDto> result = jobApplicationService.allJobApplications(USER_ID, filters, pageable);

        assertEquals(1, result.getTotalElements());
        assertMatchesJobApplication(result.getContent().get(0));
    }

    @Test
    public void oneJobApplication_ShouldReturnApplication_WhenUserOwnsIt() throws NotFoundException, UnauthorizedException {
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        assertMatchesJobApplication(jobApplicationService.oneJobApplication(USER_ID, JOB_APPLICATION_ID));
    }

    @Test
    public void createJobApplication_ShouldSaveNewApplicationForUser_WhenUserExists() throws NotFoundException {
        CreateJobApplicationDto dto = createDto();
        when(userService.fetchUserEntity(USER_ID)).thenReturn(user);

        jobApplicationService.createJobApplication(USER_ID, dto);

        ArgumentCaptor<JobApplication> savedApplicationCaptor = ArgumentCaptor.forClass(JobApplication.class);
        verify(jobApplicationRepository).save(savedApplicationCaptor.capture());

        JobApplication savedApplication = savedApplicationCaptor.getValue();
        assertEquals(dto.name(), savedApplication.getName());
        assertEquals(dto.city(), savedApplication.getCity());
        assertEquals(dto.status(), savedApplication.getStatus());
        assertEquals(dto.position(), savedApplication.getPosition());
        assertEquals(dto.note(), savedApplication.getNote());
        assertEquals(user, savedApplication.getUser());
        assertFalse(savedApplication.getIsFavorite());
        verify(activityService).createActivity(user, dto.name(), ActivityType.CREATED);
    }

    @Test
    public void createJobApplication_ShouldThrowNotFoundException_WhenUserDoesNotExist() throws NotFoundException {
        when(userService.fetchUserEntity(USER_ID)).thenThrow(new NotFoundException("User not found"));

        assertThrows(NotFoundException.class, () -> jobApplicationService.createJobApplication(USER_ID, createDto()));
    }

    @Test
    public void updateJobApplication_ShouldUpdateOnlyProvidedFields_WhenUserOwnsIt() throws NotFoundException, UnauthorizedException {
        UpdateJobApplicationDto dto = new UpdateJobApplicationDto(
                "Updated Company",
                null,
                Status.ACCEPTED,
                Position.FULLSTACK,
                true,
                null
        );
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));
        when(userService.fetchUserEntity(USER_ID)).thenReturn(user);

        jobApplicationService.updateJobApplication(USER_ID, JOB_APPLICATION_ID, dto);

        assertEquals("Updated Company", jobApplication.getName());
        assertEquals("City1", jobApplication.getCity());
        assertEquals(Status.ACCEPTED, jobApplication.getStatus());
        assertEquals(Position.FULLSTACK, jobApplication.getPosition());
        assertTrue(jobApplication.getIsFavorite());
        assertEquals("Initial note", jobApplication.getNote());
        verify(jobApplicationRepository).save(jobApplication);
        verify(activityService).createActivity(user, "Updated Company", ActivityType.UPDATED);
    }

    @Test
    public void deleteJobApplication_ShouldDeleteApplication_WhenUserOwnsIt() throws NotFoundException, UnauthorizedException {
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));
        when(userService.fetchUserEntity(USER_ID)).thenReturn(user);

        jobApplicationService.deleteJobApplication(USER_ID, JOB_APPLICATION_ID);

        verify(jobApplicationRepository).deleteById(JOB_APPLICATION_ID);
        verify(activityService).createActivity(user, jobApplication.getName(), ActivityType.DELETED);
    }

    @ParameterizedTest(name = "isFavorite {0} -> {1}")
    @ValueSource(booleans = {false, true})
    public void toggleJobApplicationFavorite_ShouldFlipFavorite_WhenUserOwnsIt(boolean initiallyFavorite)
            throws NotFoundException, UnauthorizedException {
        jobApplication.setIsFavorite(initiallyFavorite);
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        boolean result = jobApplicationService.toggleJobApplicationFavorite(USER_ID, JOB_APPLICATION_ID);

        assertEquals(!initiallyFavorite, result);
        assertEquals(!initiallyFavorite, jobApplication.getIsFavorite());
        verify(jobApplicationRepository).save(jobApplication);
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("ownedApplicationCalls")
    public void ownedApplicationCall_ShouldThrowNotFoundException_WhenApplicationDoesNotExist(OwnedApplicationCall call) {
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> call.execute(jobApplicationService, USER_ID));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("ownedApplicationCalls")
    public void ownedApplicationCall_ShouldThrowUnauthorizedException_WhenUserDoesNotOwnIt(OwnedApplicationCall call) {
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        assertThrows(UnauthorizedException.class, () -> call.execute(jobApplicationService, OTHER_USER_ID));
    }

    /**
     * Every service call that first loads the application and then checks ownership.
     */
    private static Stream<Arguments> ownedApplicationCalls() {
        return Stream.of(
                arguments(named("oneJobApplication", (OwnedApplicationCall)
                        (service, userId) -> service.oneJobApplication(userId, JOB_APPLICATION_ID))),
                arguments(named("updateJobApplication", (OwnedApplicationCall)
                        (service, userId) -> service.updateJobApplication(userId, JOB_APPLICATION_ID, updateDto()))),
                arguments(named("deleteJobApplication", (OwnedApplicationCall)
                        (service, userId) -> service.deleteJobApplication(userId, JOB_APPLICATION_ID))),
                arguments(named("toggleJobApplicationFavorite", (OwnedApplicationCall)
                        (service, userId) -> service.toggleJobApplicationFavorite(userId, JOB_APPLICATION_ID)))
        );
    }

    @FunctionalInterface
    private interface OwnedApplicationCall {
        void execute(JobApplicationService service, UUID userId) throws NotFoundException, UnauthorizedException;
    }

    private void assertMatchesJobApplication(JobApplicationDto dto) {
        assertEquals(jobApplication.getId(), dto.id());
        assertEquals(jobApplication.getName(), dto.name());
        assertEquals(jobApplication.getCity(), dto.city());
        assertEquals(jobApplication.getStatus(), dto.status());
        assertEquals(jobApplication.getPosition(), dto.position());
        assertEquals(jobApplication.getIsFavorite(), dto.isFavorite());
        assertEquals(jobApplication.getNote(), dto.note());
        assertEquals(jobApplication.getAppliedAt(), dto.appliedAt());
        assertFalse(dto.isStale());
    }

    private Page<JobApplication> pageOf(JobApplication application) {
        return new PageImpl<>(List.of(application), pageable, 1);
    }

    private static JobApplicationFilterDto emptyFilters() {
        return new JobApplicationFilterDto(null, null, null, null);
    }

    private static CreateJobApplicationDto createDto() {
        return new CreateJobApplicationDto(
                "ApplicationTest",
                "Test",
                Status.IN_PROGRESS,
                Position.FULLSTACK,
                "Created note"
        );
    }

    private static UpdateJobApplicationDto updateDto() {
        return new UpdateJobApplicationDto(
                "Updated Company",
                "CityNew",
                Status.ACCEPTED,
                Position.FULLSTACK,
                true,
                "Updated note"
        );
    }

}

package com.backend.appliboard;

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
import org.mockito.ArgumentCaptor;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
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

    @InjectMocks
    private JobApplicationService jobApplicationService;

    private User user;
    private JobApplication jobApplication;
    private Pageable pageable;

    @BeforeEach
    public void setUp() {
        user = user(USER_ID);
        jobApplication = jobApplicationOwnedBy(user);
        pageable = PageRequest.of(0, 10);
    }

    @Test
    public void allJobApplications_ShouldReturnUserApplications_WhenApplicationsExist() {
        // given
        when(jobApplicationRepository.findByUserId(USER_ID, pageable))
                .thenReturn(pageOf(jobApplication));

        // when
        Page<JobApplicationDto> result = jobApplicationService.allJobApplications(USER_ID, pageable);

        // then
        assertEquals(1, result.getTotalElements());
        JobApplicationDto dto = result.getContent().get(0);
        assertEquals(jobApplication.getId(), dto.id());
        assertEquals(jobApplication.getName(), dto.name());
        assertEquals(jobApplication.getCity(), dto.city());
        assertEquals(jobApplication.getStatus(), dto.status());
        assertEquals(jobApplication.getPosition(), dto.position());
        assertEquals(jobApplication.getIsFavorite(), dto.isFavorite());
        assertEquals(jobApplication.getAppliedAt(), dto.appliedAt());
    }

    @Test
    public void allJobApplications_ShouldReturnEmptyPage_WhenUserHasNoApplications() {
        // given
        when(jobApplicationRepository.findByUserId(USER_ID, pageable))
                .thenReturn(Page.empty(pageable));

        // when
        Page<JobApplicationDto> result = jobApplicationService.allJobApplications(USER_ID, pageable);

        // then
        assertTrue(result.isEmpty());
    }

    @Test
    public void searchJobApplications_ShouldReturnFilteredApplications_WhenMatchesExist() {
        // given
        JobApplicationFilterDto filters = new JobApplicationFilterDto(
                "appli",
                List.of(Status.PENDING),
                List.of(Position.BACKEND),
                false
        );
        when(jobApplicationRepository.findAll(
                org.mockito.ArgumentMatchers.<Specification<JobApplication>>any(),
                any(Pageable.class)
        )).thenReturn(pageOf(jobApplication));

        // when
        Page<JobApplicationDto> result = jobApplicationService.searchJobApplications(USER_ID, filters, pageable);

        // then
        assertEquals(1, result.getTotalElements());
        JobApplicationDto dto = result.getContent().get(0);
        assertEquals(jobApplication.getId(), dto.id());
        assertEquals(jobApplication.getName(), dto.name());
        assertEquals(jobApplication.getCity(), dto.city());
        assertEquals(jobApplication.getStatus(), dto.status());
        assertEquals(jobApplication.getPosition(), dto.position());
        assertEquals(jobApplication.getIsFavorite(), dto.isFavorite());
        assertEquals(jobApplication.getAppliedAt(), dto.appliedAt());
    }

    @Test
    public void oneJobApplication_ShouldReturnApplication_WhenUserOwnsIt() throws NotFoundException, UnauthorizedException {
        // given
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        // when
        JobApplicationDto result = jobApplicationService.oneJobApplication(USER_ID, JOB_APPLICATION_ID);

        // then
        assertEquals(jobApplication.getId(), result.id());
        assertEquals(jobApplication.getName(), result.name());
        assertEquals(jobApplication.getCity(), result.city());
        assertEquals(jobApplication.getStatus(), result.status());
        assertEquals(jobApplication.getPosition(), result.position());
        assertEquals(jobApplication.getIsFavorite(), result.isFavorite());
        assertEquals(jobApplication.getAppliedAt(), result.appliedAt());
    }

    @Test
    public void oneJobApplication_ShouldThrowNotFoundException_WhenApplicationDoesNotExist() {
        // given
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.empty());

        // when / then
        assertThrows(NotFoundException.class, () -> jobApplicationService.oneJobApplication(USER_ID, JOB_APPLICATION_ID));
    }

    @Test
    public void oneJobApplication_ShouldThrowUnauthorizedException_WhenUserDoesNotOwnIt() {
        // given
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        // when / then
        assertThrows(UnauthorizedException.class, () -> jobApplicationService.oneJobApplication(OTHER_USER_ID, JOB_APPLICATION_ID));
    }

    @Test
    public void createJobApplication_ShouldSaveNewApplicationForUser_WhenUserExists() throws NotFoundException {
        // given
        CreateJobApplicationDto dto = createDto();
        when(userService.fetchUserEntity(USER_ID)).thenReturn(user);

        // when
        jobApplicationService.createJobApplication(USER_ID, dto);

        // then
        ArgumentCaptor<JobApplication> jobApplicationCaptor = ArgumentCaptor.forClass(JobApplication.class);
        verify(jobApplicationRepository).save(jobApplicationCaptor.capture());

        JobApplication savedApplication = jobApplicationCaptor.getValue();
        assertEquals(dto.name(), savedApplication.getName());
        assertEquals(dto.city(), savedApplication.getCity());
        assertEquals(dto.status(), savedApplication.getStatus());
        assertEquals(dto.position(), savedApplication.getPosition());
        assertEquals(user, savedApplication.getUser());
        assertFalse(savedApplication.getIsFavorite());
    }

    @Test
    public void createJobApplication_ShouldThrowNotFoundException_WhenUserDoesNotExist() throws NotFoundException {
        // given
        when(userService.fetchUserEntity(USER_ID)).thenThrow(new NotFoundException("User not found"));

        // when / then
        assertThrows(NotFoundException.class, () -> jobApplicationService.createJobApplication(USER_ID, createDto()));
    }

    @Test
    public void updateJobApplication_ShouldUpdateOnlyProvidedFields_WhenUserOwnsIt() throws NotFoundException, UnauthorizedException {
        // given
        UpdateJobApplicationDto dto = new UpdateJobApplicationDto(
                "Updated Company",
                null,
                Status.ACCEPTED,
                Position.FULLSTACK,
                true
        );
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        // when
        jobApplicationService.updateJobApplication(USER_ID, JOB_APPLICATION_ID, dto);

        // then
        assertEquals("Updated Company", jobApplication.getName());
        assertEquals("CityNew", jobApplication.getCity());
        assertEquals(Status.ACCEPTED, jobApplication.getStatus());
        assertEquals(Position.FULLSTACK, jobApplication.getPosition());
        assertTrue(jobApplication.getIsFavorite());
        verify(jobApplicationRepository).save(jobApplication);
    }

    @Test
    public void updateJobApplication_ShouldThrowNotFoundException_WhenApplicationDoesNotExist() {
        // given
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.empty());

        // when / then
        assertThrows(
                NotFoundException.class,
                () -> jobApplicationService.updateJobApplication(USER_ID, JOB_APPLICATION_ID, updateDto())
        );
    }

    @Test
    public void updateJobApplication_ShouldThrowUnauthorizedException_WhenUserDoesNotOwnIt() {
        // given
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        // when / then
        assertThrows(
                UnauthorizedException.class,
                () -> jobApplicationService.updateJobApplication(OTHER_USER_ID, JOB_APPLICATION_ID, updateDto())
        );
    }

    @Test
    public void deleteJobApplication_ShouldDeleteApplication_WhenUserOwnsIt() throws NotFoundException, UnauthorizedException {
        // given
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        // when
        jobApplicationService.deleteJobApplication(USER_ID, JOB_APPLICATION_ID);

        // then
        verify(jobApplicationRepository).deleteById(JOB_APPLICATION_ID);
    }

    @Test
    public void deleteJobApplication_ShouldThrowNotFoundException_WhenApplicationDoesNotExist() {
        // given
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.empty());

        // when / then
        assertThrows(
                NotFoundException.class,
                () -> jobApplicationService.deleteJobApplication(USER_ID, JOB_APPLICATION_ID)
        );
    }

    @Test
    public void deleteJobApplication_ShouldThrowUnauthorizedException_WhenUserDoesNotOwnIt() {
        // given
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        // when / then
        assertThrows(
                UnauthorizedException.class,
                () -> jobApplicationService.deleteJobApplication(OTHER_USER_ID, JOB_APPLICATION_ID)
        );
    }

    @Test
    public void toggleJobApplicationFavorite_ShouldMarkApplicationAsFavorite_WhenItIsNotFavorite() throws NotFoundException, UnauthorizedException {
        // given
        jobApplication.setIsFavorite(false);
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        // when
        boolean result = jobApplicationService.toggleJobApplicationFavorite(USER_ID, JOB_APPLICATION_ID);

        // then
        assertTrue(result);
        assertTrue(jobApplication.getIsFavorite());
        verify(jobApplicationRepository).save(jobApplication);
    }

    @Test
    public void toggleJobApplicationFavorite_ShouldUnmarkApplicationAsFavorite_WhenItIsFavorite() throws NotFoundException, UnauthorizedException {
        // given
        jobApplication.setIsFavorite(true);
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        // when
        boolean result = jobApplicationService.toggleJobApplicationFavorite(USER_ID, JOB_APPLICATION_ID);

        // then
        assertFalse(result);
        assertFalse(jobApplication.getIsFavorite());
        verify(jobApplicationRepository).save(jobApplication);
    }

    @Test
    public void toggleJobApplicationFavorite_ShouldThrowNotFoundException_WhenApplicationDoesNotExist() {
        // given
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.empty());

        // when / then
        assertThrows(
                NotFoundException.class,
                () -> jobApplicationService.toggleJobApplicationFavorite(USER_ID, JOB_APPLICATION_ID)
        );
    }

    @Test
    public void toggleJobApplicationFavorite_ShouldThrowUnauthorizedException_WhenUserDoesNotOwnIt() {
        // given
        when(jobApplicationRepository.findById(JOB_APPLICATION_ID)).thenReturn(Optional.of(jobApplication));

        // when / then
        assertThrows(
                UnauthorizedException.class,
                () -> jobApplicationService.toggleJobApplicationFavorite(OTHER_USER_ID, JOB_APPLICATION_ID)
        );
    }

    private Page<JobApplication> pageOf(JobApplication application) {
        return new PageImpl<>(List.of(application), pageable, 1);
    }

    private CreateJobApplicationDto createDto() {
        return new CreateJobApplicationDto(
                "ApplicationTest",
                "Test",
                Status.IN_PROGRESS,
                Position.FULLSTACK
        );
    }

    private UpdateJobApplicationDto updateDto() {
        return new UpdateJobApplicationDto(
                "Updated Company",
                "CityNew",
                Status.ACCEPTED,
                Position.FULLSTACK,
                true
        );
    }

    private User user(UUID id) {
        return User.builder()
                .id(id)
                .firstName("Test")
                .lastName("User")
                .email("test.user@example.com")
                .password("encoded-password")
                .avatarUrl("avatar-url")
                .role(Role.USER)
                .build();
    }

    private JobApplication jobApplicationOwnedBy(User owner) {
        return JobApplication.builder()
                .id(JOB_APPLICATION_ID)
                .name("AppliTest")
                .city("City1")
                .status(Status.PENDING)
                .position(Position.BACKEND)
                .isFavorite(false)
                .user(owner)
                .appliedAt(APPLIED_AT)
                .build();
    }

}

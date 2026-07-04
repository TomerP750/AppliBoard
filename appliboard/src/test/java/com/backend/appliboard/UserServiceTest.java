package com.backend.appliboard;

import com.backend.appliboard.features.user.Role;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserRepository;
import com.backend.appliboard.features.user.UserService;
import com.backend.appliboard.features.user.dto.UpdateUserDto;
import com.backend.appliboard.features.user.dto.UserDto;
import com.backend.appliboard.shared.FoundException;
import com.backend.appliboard.shared.NotFoundException;
import com.backend.appliboard.shared.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepositoryMock;

    @InjectMocks
    private UserService userServiceMock;

    private UUID userId;
    private User user;

    @BeforeEach
    public void setUpUser() {
        userId = UUID.randomUUID();
        user = User.builder()
                .id(userId)
                .firstName("Test")
                .lastName("User")
                .email("test.user@example.com")
                .password("encoded-password")
                .avatarUrl("avatar-url")
                .role(Role.USER)
                .build();
    }

    @Test
    public void updateUser_ShouldUpdateUser_WhenCredentialsAreValid() throws NotFoundException, UnauthorizedException, FoundException {
        UpdateUserDto dto = new UpdateUserDto(
                "Updated",
                "Name",
                "updated.user@example.com",
                "avatar-url"
        );

        when(userRepositoryMock.findById(userId)).thenReturn(Optional.of(user));
        when(userRepositoryMock.existsByEmail(dto.email())).thenReturn(false);

        userServiceMock.updateUser(userId, dto);

        assertEquals(dto.firstName(), user.getFirstName());
        assertEquals(dto.lastName(), user.getLastName());
        assertEquals(dto.email(), user.getEmail());
        assertEquals(dto.avatarUrl(), user.getAvatarUrl());
        verify(userRepositoryMock).save(user);
    }

    @Test
    public void deleteUser_ShouldDeleteUser_WhenUserIdIsValid() throws NotFoundException, UnauthorizedException {
        userServiceMock.deleteUser(userId);

        verify(userRepositoryMock).deleteById(userId);
    }

    @Test
    public void me_ShouldReturnUser_WhenUserIdIsValid() throws NotFoundException {
        when(userRepositoryMock.findById(userId)).thenReturn(Optional.of(user));

        UserDto result = userServiceMock.me(userId);

        assertEquals(user.getId(), result.id());
        assertEquals(user.getFirstName(), result.firstName());
        assertEquals(user.getLastName(), result.lastName());
        assertEquals(user.getEmail(), result.email());
        assertEquals(user.getAvatarUrl(), result.avatarUrl());
        assertEquals(user.getRole(), result.role());
    }

    @Test
    public void updateUser_ShouldThrowNotFoundException_WhenUserDoesNotExist() {
        UpdateUserDto dto = new UpdateUserDto(
                "Updated",
                "Name",
                "updated.user@example.com",
                "avatar-url"
        );

        when(userRepositoryMock.findById(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> userServiceMock.updateUser(userId, dto));
        verify(userRepositoryMock, never()).save(user);
    }

    @Test
    public void updateUser_ShouldThrowFoundException_WhenEmailAlreadyExists() {
        UpdateUserDto dto = new UpdateUserDto(
                "Updated",
                "Name",
                "updated.user@example.com",
                "avatar-url"
        );

        when(userRepositoryMock.findById(userId)).thenReturn(Optional.of(user));
        when(userRepositoryMock.existsByEmail(dto.email())).thenReturn(true);

        assertThrows(FoundException.class, () -> userServiceMock.updateUser(userId, dto));
        verify(userRepositoryMock, never()).save(user);
    }

    @Test
    public void updateUser_ShouldThrowUnauthorizedException_WhenUserIdDoesNotMatch() {
        UUID otherUserId = UUID.randomUUID();
        User otherUser = User.builder()
                .id(otherUserId)
                .firstName("Other")
                .lastName("User")
                .email("other.user@example.com")
                .password("encoded-password")
                .avatarUrl("avatar-url")
                .role(Role.USER)
                .build();
        UpdateUserDto dto = new UpdateUserDto(
                "Updated",
                "Name",
                "updated.user@example.com",
                "avatar-url"
        );

        when(userRepositoryMock.findById(userId)).thenReturn(Optional.of(otherUser));

        assertThrows(UnauthorizedException.class, () -> userServiceMock.updateUser(userId, dto));
        verify(userRepositoryMock, never()).save(otherUser);
    }

    @Test
    public void me_ShouldThrowNotFoundException_WhenUserDoesNotExist() {
        when(userRepositoryMock.findById(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> userServiceMock.me(userId));
    }

}

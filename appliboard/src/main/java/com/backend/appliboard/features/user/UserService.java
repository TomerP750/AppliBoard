package com.backend.appliboard.features.user;

import com.backend.appliboard.features.user.dto.ChangePasswordDto;
import com.backend.appliboard.features.user.dto.UpdateUserDto;
import com.backend.appliboard.features.user.dto.UserDto;
import com.backend.appliboard.shared.FoundException;
import com.backend.appliboard.shared.NotFoundException;
import com.backend.appliboard.shared.InvalidInputException;
import com.backend.appliboard.shared.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService implements IUserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserDto> allUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(UserMapper::toUserDto);
    }

    @Override
    public UserDto me(UUID userId) throws NotFoundException {
        User user = fetchUserEntity(userId);
        return UserMapper.toUserDto(user);
    }

    @Override
    @Transactional
    public void updateUser(UUID userId, UpdateUserDto dto) throws NotFoundException, UnauthorizedException, FoundException {

        User user = fetchUserEntity(userId);

        if (!user.getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this user");
        }

        if (dto.email() != null && !dto.email().isEmpty() && !dto.email().equals(user.getEmail()) && userRepository.existsByEmail(dto.email())) {
            throw new FoundException("Email already exists");
        }

        if (dto.firstName() != null && !dto.firstName().isEmpty()) {
            user.setFirstName(dto.firstName());
        }
        if (dto.lastName() != null && !dto.lastName().isEmpty()) {
            user.setLastName(dto.lastName());
        }
        if (dto.email() != null && !dto.email().isEmpty()) {
            user.setEmail(dto.email());
        }
        if (dto.avatarUrl() != null && !dto.avatarUrl().isEmpty()) {
            user.setAvatarUrl(dto.avatarUrl());
        }

        userRepository.save(user);

        log.info("User updated");


    }

    @Override
    @Transactional
    public void deleteUser(UUID userId) throws NotFoundException, UnauthorizedException {
        userRepository.deleteById(userId);
        log.info("User deleted");
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordDto dto) throws NotFoundException, InvalidInputException {

        User user = fetchUserEntity(userId);

        if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
            throw new InvalidInputException("Current password is incorrect");
        }

        if (!dto.newPassword().equals(dto.confirmNewPassword())) {
            throw new InvalidInputException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(dto.newPassword()));

        userRepository.save(user);

    }

    public User fetchUserEntity(UUID userId) throws NotFoundException {
        return userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
    }
    
}

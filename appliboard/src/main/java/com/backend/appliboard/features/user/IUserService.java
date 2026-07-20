package com.backend.appliboard.features.user;

import com.backend.appliboard.features.user.dto.ChangePasswordDto;
import com.backend.appliboard.features.user.dto.UpdateUserDto;
import com.backend.appliboard.features.user.dto.UserDto;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.InvalidInputException;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import com.backend.appliboard.shared.exceptions.UnauthorizedException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IUserService {

    Page<UserDto> allUsers(Pageable pageable);

    UserDto me(UUID userId) throws NotFoundException;

    void updateUser(UUID userId ,UpdateUserDto dto) throws NotFoundException, UnauthorizedException, FoundException;

    void deleteUser(UUID userId) throws NotFoundException, UnauthorizedException;

    void changePassword(UUID userId, ChangePasswordDto dto) throws NotFoundException, InvalidInputException;

}

package com.backend.appliboard.features.user;

import com.backend.appliboard.features.user.dto.ChangePasswordDto;
import com.backend.appliboard.features.user.dto.UpdateUserDto;
import com.backend.appliboard.features.user.dto.UserDto;
import com.backend.appliboard.infrastructures.security.PrincipalUser;
import com.backend.appliboard.shared.NotFoundException;
import com.backend.appliboard.shared.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserDto me(@AuthenticationPrincipal PrincipalUser principalUser) throws NotFoundException {
        UUID userId = principalUser.getUserId();
        return userService.me(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public Page<UserDto> allUsers(@RequestParam(name = "page", defaultValue = "0") int page,
                                  @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.allUsers(pageable);
    }

    @PutMapping("/update")
    public void updateUser(@AuthenticationPrincipal PrincipalUser principalUser, @RequestBody UpdateUserDto dto) throws UnauthorizedException, NotFoundException {
        UUID userId = principalUser.getUserId();
        userService.updateUser(userId, dto);
    }

    @DeleteMapping("/delete")
    public void deleteUser(@AuthenticationPrincipal PrincipalUser principalUser) throws UnauthorizedException, NotFoundException {
        UUID userId = principalUser.getUserId();
        userService.deleteUser(userId);
    }

    @PatchMapping("change-password")
    public void changePassword(@AuthenticationPrincipal PrincipalUser principalUser, @RequestBody ChangePasswordDto dto) throws NotFoundException {
        UUID userId = principalUser.getUserId();
        userService.changePassword(userId, dto);
    }

}
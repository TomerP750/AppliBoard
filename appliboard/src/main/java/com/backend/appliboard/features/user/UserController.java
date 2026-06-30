package com.backend.appliboard.features.user;

import com.backend.appliboard.features.user.dto.ChangePasswordDto;
import com.backend.appliboard.features.user.dto.UpdateUserDto;
import com.backend.appliboard.features.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

//    @GetMapping("/me")
//    public UserDto me() {
//        return userService.me();
//    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public Page<UserDto> allUsers(@RequestParam(name = "page", defaultValue = "0") int page,
                                  @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.allUsers(pageable);
    }

//    @PutMapping("/update")
//    public void updateUser(@RequestBody UpdateUserDto dto) {
//        userService.updateUser();
//    }

//    @DeleteMapping("/delete")
//    public void deleteUser() {
//        userService.deleteUser();
//    }
//
//    @PatchMapping("change-password")
//    public void changePassword(@RequestBody ChangePasswordDto dto) {
//        userService.changePassword(,dto);
    

}

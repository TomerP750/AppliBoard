package com.backend.appliboard.features.user;

import com.backend.appliboard.features.user.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    private UserMapper() {}

    public static UserDto toUserDto(User entity) {
        return new UserDto(
                entity.getId(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getEmail(),
                entity.getAvatarUrl()
        );
    }
}

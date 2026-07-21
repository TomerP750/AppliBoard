package com.backend.appliboard.features.authentication.dto;

import com.backend.appliboard.features.user.dto.UserDto;

public record AuthResponseDto(
        String accessToken,
        UserDto userDto
) {
}

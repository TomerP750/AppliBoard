package com.backend.appliboard.features.user.dto;

import com.backend.appliboard.features.user.Role;

import java.util.UUID;

public record UserDto(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String avatarUrl,
        Role role
) {
}

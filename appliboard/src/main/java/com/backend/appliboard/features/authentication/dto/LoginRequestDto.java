package com.backend.appliboard.features.authentication.dto;

public record LoginRequestDto(
        String email,
        String password
) {
}

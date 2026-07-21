package com.backend.appliboard.features.authentication;

import com.backend.appliboard.features.authentication.dto.AuthResponseDto;

public record InternalAuthResult(
        AuthResponseDto authResponse,
        String refreshToken
) {
}

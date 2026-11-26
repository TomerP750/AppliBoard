package com.backend.appliboard.features.authentication;

import com.backend.appliboard.features.authentication.dto.AuthResponseDto;

/**
 * What the service hands the controller after login, signup or refresh: the response body and the refresh token,
 * which the controller puts in an HttpOnly cookie instead of the body.
 */
public record AuthSession(AuthResponseDto authResponse, String refreshToken) {
}

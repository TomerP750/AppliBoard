package com.backend.appliboard.features.authentication.refresh_token;

import com.backend.appliboard.shared.exceptions.InvalidRefreshTokenException;

import java.util.UUID;

public interface IRefreshTokenService {

    String issue(UUID userId);

    RefreshToken validate(String rawToken) throws InvalidRefreshTokenException;

    String rotate(String rawToken) throws InvalidRefreshTokenException;

    void revoke(String rawToken) throws InvalidRefreshTokenException;

}

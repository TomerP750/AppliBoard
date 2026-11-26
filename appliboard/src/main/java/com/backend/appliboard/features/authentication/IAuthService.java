package com.backend.appliboard.features.authentication;

import com.backend.appliboard.features.authentication.dto.LoginRequestDto;
import com.backend.appliboard.features.authentication.dto.SignupRequestDto;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.InvalidInputException;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import com.backend.appliboard.shared.exceptions.UnauthorizedException;

public interface IAuthService {

    AuthSession login(LoginRequestDto dto) throws NotFoundException;

    AuthSession signup(SignupRequestDto dto) throws InvalidInputException, FoundException;

    /** Rotates the refresh token and issues a new access token for the same session. */
    AuthSession refresh(String refreshToken) throws UnauthorizedException;

    /** Ends the session of the refresh token. Always succeeds, even for unknown tokens. */
    void logout(String refreshToken);

}

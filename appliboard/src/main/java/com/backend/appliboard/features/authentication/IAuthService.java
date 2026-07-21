package com.backend.appliboard.features.authentication;

import com.backend.appliboard.features.authentication.dto.LoginRequestDto;
import com.backend.appliboard.features.authentication.dto.SignupRequestDto;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.InvalidInputException;
import com.backend.appliboard.shared.exceptions.InvalidRefreshTokenException;
import com.backend.appliboard.shared.exceptions.NotFoundException;

public interface IAuthService {

    InternalAuthResult login(LoginRequestDto dto) throws NotFoundException;

    InternalAuthResult signup(SignupRequestDto dto) throws InvalidInputException, FoundException;

    InternalAuthResult refreshToken(String rawToken) throws NotFoundException, InvalidRefreshTokenException;

}

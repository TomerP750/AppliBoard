package com.backend.appliboard.features.authentication;

import com.backend.appliboard.features.authentication.dto.AuthResponseDto;
import com.backend.appliboard.features.authentication.dto.LoginRequestDto;
import com.backend.appliboard.features.authentication.dto.SignupRequestDto;
import com.backend.appliboard.shared.InvalidInputException;
import com.backend.appliboard.shared.NotFoundException;

public interface IAuthService {

    AuthResponseDto login(LoginRequestDto dto) throws NotFoundException;

    AuthResponseDto signup(SignupRequestDto dto) throws InvalidInputException;

    void refreshToken();

}

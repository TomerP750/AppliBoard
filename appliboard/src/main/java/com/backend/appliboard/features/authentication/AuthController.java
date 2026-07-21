package com.backend.appliboard.features.authentication;

import com.backend.appliboard.features.authentication.dto.AuthResponseDto;
import com.backend.appliboard.features.authentication.dto.LoginRequestDto;
import com.backend.appliboard.features.authentication.dto.SignupRequestDto;
import com.backend.appliboard.features.authentication.refresh_token.RefreshTokenCookieService;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.InvalidInputException;
import com.backend.appliboard.shared.exceptions.InvalidRefreshTokenException;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenCookieService refreshTokenCookieService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto dto) throws NotFoundException {

        InternalAuthResult result = authService.login(dto);

        ResponseCookie cookie = refreshTokenCookieService.create(result.refreshToken());

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        cookie.toString()
                )
                .body(result.authResponse());
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(@Valid @RequestBody SignupRequestDto dto) throws InvalidInputException, FoundException {

        InternalAuthResult result = authService.signup(dto);

        ResponseCookie cookie = refreshTokenCookieService.create(result.refreshToken());

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        cookie.toString()
                )
                .body(result.authResponse());
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(@CookieValue("refreshToken") String rawToken)
            throws InvalidRefreshTokenException, NotFoundException {

        InternalAuthResult result = authService.refreshToken(rawToken);

        ResponseCookie cookie =
                refreshTokenCookieService.create(result.refreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(result.authResponse());
    }


}

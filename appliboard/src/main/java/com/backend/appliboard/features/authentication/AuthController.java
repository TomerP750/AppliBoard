package com.backend.appliboard.features.authentication;

import com.backend.appliboard.features.authentication.dto.AuthResponseDto;
import com.backend.appliboard.features.authentication.dto.LoginRequestDto;
import com.backend.appliboard.features.authentication.dto.SignupRequestDto;
import com.backend.appliboard.infrastructures.security.RefreshTokenCookie;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.InvalidInputException;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import com.backend.appliboard.shared.exceptions.UnauthorizedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenCookie refreshTokenCookie;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto dto) throws NotFoundException {
        return withRefreshTokenCookie(authService.login(dto));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(@Valid @RequestBody SignupRequestDto dto) throws InvalidInputException, FoundException {
        return withRefreshTokenCookie(authService.signup(dto));
    }

    /** Swaps the refresh token cookie for a new one and returns a fresh access token. */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(
            @CookieValue(name = RefreshTokenCookie.NAME, required = false) String refreshToken
    ) throws UnauthorizedException {
        return withRefreshTokenCookie(authService.refresh(refreshToken));
    }

    /** Ends the refresh token's session and tells the browser to delete the cookie. */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = RefreshTokenCookie.NAME, required = false) String refreshToken
    ) {
        authService.logout(refreshToken);
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.buildExpiredRefreshTokenCookie().toString())
                .build();
    }

    private ResponseEntity<AuthResponseDto> withRefreshTokenCookie(AuthSession session) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.buildRefreshTokenCookie(session.refreshToken()).toString())
                .body(session.authResponse());
    }
}

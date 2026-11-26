package com.backend.appliboard.features.authentication;

import com.backend.appliboard.features.authentication.dto.AuthResponseDto;
import com.backend.appliboard.features.authentication.dto.LoginRequestDto;
import com.backend.appliboard.features.authentication.dto.SignupRequestDto;
import com.backend.appliboard.features.user.Role;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserMapper;
import com.backend.appliboard.features.user.UserRepository;
import com.backend.appliboard.infrastructures.security.JwtService;
import com.backend.appliboard.infrastructures.security.RefreshTokenStore;
import com.backend.appliboard.infrastructures.security.RotatedRefreshToken;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.InvalidInputException;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import com.backend.appliboard.shared.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenStore refreshTokenStore;

    @Override
    @Transactional
    public AuthSession login(LoginRequestDto dto) throws NotFoundException {

        log.info("Entering Login");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );

        User user = userRepository.findByEmail(dto.email()).orElseThrow(() -> new NotFoundException("User not found"));

        log.info("Logged In Successfully");

        return startSession(user);
    }

    @Override
    @Transactional
    public AuthSession signup(SignupRequestDto dto) throws InvalidInputException, FoundException {

        log.info("Signing User Up");

        if (!dto.password().equals(dto.confirmPassword())) {
            throw new InvalidInputException("Passwords do not match");
        }

        if (userRepository.existsByEmail(dto.email())) {
            throw new FoundException("Email Already Exists");
        }

        User user = User.builder()
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        log.info("User Signed Up Successfully");

        return startSession(user);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthSession refresh(String refreshToken) throws UnauthorizedException {
        RotatedRefreshToken rotatedToken = refreshTokenStore.rotateRefreshToken(refreshToken);

        User user = userRepository.findById(rotatedToken.userId()).orElse(null);
        if (user == null) {
            refreshTokenStore.revokeRefreshToken(rotatedToken.token());
            throw new UnauthorizedException("Refresh token expired or revoked");
        }

        return new AuthSession(buildAuthResponse(user), rotatedToken.token());
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenStore.revokeRefreshToken(refreshToken);
    }

    private AuthSession startSession(User user) {
        String refreshToken = refreshTokenStore.createRefreshToken(user.getId());
        return new AuthSession(buildAuthResponse(user), refreshToken);
    }

    private AuthResponseDto buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponseDto(accessToken, UserMapper.toUserDto(user));
    }

}

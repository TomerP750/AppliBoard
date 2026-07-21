package com.backend.appliboard.features.authentication;

import com.backend.appliboard.features.authentication.dto.AuthResponseDto;
import com.backend.appliboard.features.authentication.dto.LoginRequestDto;
import com.backend.appliboard.features.authentication.dto.SignupRequestDto;
import com.backend.appliboard.features.authentication.refresh_token.RefreshTokenService;
import com.backend.appliboard.features.user.Role;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserMapper;
import com.backend.appliboard.features.user.UserRepository;
import com.backend.appliboard.features.user.dto.UserDto;
import com.backend.appliboard.infrastructures.security.JwtService;
import com.backend.appliboard.infrastructures.security.PrincipalUser;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.InvalidInputException;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
    private final RefreshTokenService refreshTokenService;

    @Override
    @Transactional
    public InternalAuthResult login(LoginRequestDto dto) throws NotFoundException {

        log.info("Entering Login");

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );

        PrincipalUser principal = (PrincipalUser) auth.getPrincipal();

        String accessToken = jwtService.generateAccessToken(principal.getUserId(), principal.getEmail(), principal.getRole());

        log.info("Logged In Successfully");

        User user = userRepository.findByEmail(dto.email()).orElseThrow(() -> new NotFoundException("User not found"));
        UserDto userDto = UserMapper.toUserDto(user);

        String refreshToken = refreshTokenService.issue(user.getId());

        return buildInternalAuthResult(accessToken, refreshToken, userDto);

    }

    @Override
    @Transactional
    public InternalAuthResult signup(SignupRequestDto dto) throws InvalidInputException, FoundException {

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

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), Role.USER);

        UserDto userDto = UserMapper.toUserDto(user);

        String refreshToken = refreshTokenService.issue(user.getId());

        log.info("User Signed Up Successfully");

        return buildInternalAuthResult(accessToken, refreshToken, userDto);
    }

    private InternalAuthResult buildInternalAuthResult(String accessToken, String refreshToken, UserDto userDto) {
        AuthResponseDto authResponseDto = new AuthResponseDto(
                accessToken, userDto
        );

        return new InternalAuthResult(authResponseDto, refreshToken);
    }

    @Override
    public void refreshToken() {

    }

}

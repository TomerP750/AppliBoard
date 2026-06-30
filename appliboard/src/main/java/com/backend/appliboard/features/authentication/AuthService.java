package com.backend.appliboard.features.authentication;

import com.backend.appliboard.features.authentication.dto.AuthResponseDto;
import com.backend.appliboard.features.authentication.dto.LoginRequestDto;
import com.backend.appliboard.features.authentication.dto.SignupRequestDto;
import com.backend.appliboard.features.user.Role;
import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserRepository;
import com.backend.appliboard.infrastructures.security.JwtService;
import com.backend.appliboard.infrastructures.security.PrincipalUser;
import com.backend.appliboard.shared.InvalidInputException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );

        PrincipalUser principal = (PrincipalUser) auth.getPrincipal();

        String token = jwtService.generateToken(principal.getUserId(), principal.getEmail(), principal.getRole());
        return new AuthResponseDto(token);
    }

    @Override
    public AuthResponseDto signup(SignupRequestDto dto) throws InvalidInputException {

        if (!dto.password().equals(dto.confirmPassword())) {
            throw new InvalidInputException("Passwords do not match");
        }

        User user = User.builder()
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail(), Role.USER);
        return new AuthResponseDto(token);
    }

    @Override
    public void refreshToken() {

    }

}

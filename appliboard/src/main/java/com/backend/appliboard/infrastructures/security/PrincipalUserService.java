package com.backend.appliboard.infrastructures.security;

import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrincipalUserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new NoSuchElementException("User not found"));

        return new PrincipalUser(user.getId(), user.getEmail(), user.getPassword(), user.getRole());
    }

    public PrincipalUser loadByUserId(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));

        return new PrincipalUser(user.getId(), user.getEmail(), user.getPassword(), user.getRole());
    }
}

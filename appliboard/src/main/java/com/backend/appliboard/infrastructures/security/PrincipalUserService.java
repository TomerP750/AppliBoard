package com.backend.appliboard.infrastructures.security;

import com.backend.appliboard.features.user.User;
import com.backend.appliboard.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrincipalUserService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Used by login. Throwing {@link UsernameNotFoundException} lets Spring answer an unknown email exactly like a
     * wrong password ("Bad credentials"), so the login form doesn't reveal which emails are registered.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new PrincipalUser(user.getId(), user.getEmail(), user.getPassword(), user.getRole());
    }

    /**
     * @throws UsernameNotFoundException when the user no longer exists, for example after deleting their account
     */
    public PrincipalUser loadByUserId(UUID userId) throws UsernameNotFoundException {
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new PrincipalUser(user.getId(), user.getEmail(), user.getPassword(), user.getRole());
    }
}

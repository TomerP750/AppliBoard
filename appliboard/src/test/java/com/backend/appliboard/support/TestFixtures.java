package com.backend.appliboard.support;

import com.backend.appliboard.features.user.Role;
import com.backend.appliboard.features.user.User;

import java.util.UUID;

/** Shared test entities with sensible defaults. Override fields on the returned object as needed. */
public final class TestFixtures {

    private TestFixtures() {
    }

    public static User user(UUID userId) {
        return User.builder()
                .id(userId)
                .firstName("Test")
                .lastName("User")
                .email("test.user@example.com")
                .password("encoded-password")
                .avatarUrl("avatar-url")
                .role(Role.USER)
                .build();
    }
}

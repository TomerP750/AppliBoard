package com.backend.appliboard;

import com.backend.appliboard.infrastructures.security.RefreshTokenCookie;
import com.backend.appliboard.support.IntegrationTestBase;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Runs the refresh-token flow against real Redis, so the Lua scripts in {@code RefreshTokenStore}
 * and the refresh cookie are tested for real, which the mocked unit tests can't do.
 */
class AuthIntegrationTest extends IntegrationTestBase {

    @Test
    void refresh_ShouldRevokeTheWholeSession_WhenAnOldRefreshTokenIsReused() throws Exception {
        // Arrange: a new user, which starts a session with its first refresh token
        Cookie firstRefreshCookie = signUpAndGetRefreshCookie();

        // Act + Assert 1: refreshing works and replaces the token with a new one
        Cookie secondRefreshCookie = refresh(firstRefreshCookie)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andReturn().getResponse().getCookie(RefreshTokenCookie.NAME);
        assertThat(secondRefreshCookie).isNotNull();
        assertThat(secondRefreshCookie.getValue()).isNotEqualTo(firstRefreshCookie.getValue());

        // Act + Assert 2: the old token is used again, so it's treated as stolen
        refresh(firstRefreshCookie).andExpect(status().isUnauthorized());

        // Act + Assert 3: the whole session was revoked, so even the newest token no longer works
        refresh(secondRefreshCookie).andExpect(status().isUnauthorized());
    }

    /** Signs up a user with a unique email, so tests don't depend on each other's data. */
    private Cookie signUpAndGetRefreshCookie() throws Exception {
        String uniqueEmail = "auth-test-" + UUID.randomUUID() + "@example.com";
        String signupJson = """
                {
                  "firstName": "Test",
                  "lastName": "User",
                  "email": "%s",
                  "password": "password123",
                  "confirmPassword": "password123"
                }
                """.formatted(uniqueEmail);

        Cookie refreshCookie = mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signupJson))
                .andExpect(status().isOk())
                .andReturn().getResponse().getCookie(RefreshTokenCookie.NAME);

        assertThat(refreshCookie).isNotNull();
        return refreshCookie;
    }

    private ResultActions refresh(Cookie refreshCookie) throws Exception {
        return mockMvc.perform(post("/api/auth/refresh").cookie(refreshCookie));
    }
}

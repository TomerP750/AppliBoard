package com.backend.appliboard;

import com.backend.appliboard.infrastructures.security.RefreshTokenCookie;
import com.backend.appliboard.support.IntegrationTestBase;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Runs the auth and session flows against real MySQL and Redis, so the Lua scripts in {@code RefreshTokenStore},
 * the refresh cookie, the security filter chain and the after-commit listeners are tested for real,
 * which the mocked unit tests can't do.
 */
class AuthIntegrationTest extends IntegrationTestBase {

    private static final String TEST_PASSWORD = "password123";
    /** Must match {@code jwt.refresh-expiration-ms} (7 days) in application.properties. */
    private static final long REFRESH_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

    // ---- Login and cookie -------------------------------------------------------------------------------------

    @Test
    void login_ShouldSetAnHttpOnlyRefreshCookie_OnlyForAuthEndpoints() throws Exception {
        // Arrange: an existing user
        String email = newUniqueEmail();
        signUp(email);

        // Act: log in
        String setCookieHeader = logIn(email, TEST_PASSWORD)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andReturn().getResponse().getHeader(HttpHeaders.SET_COOKIE);

        // Assert: the cookie can't be read by JavaScript, isn't sent by other sites,
        // is only sent to /api/auth, and lives as long as the session
        assertThat(setCookieHeader)
                .startsWith(RefreshTokenCookie.NAME + "=")
                .contains("HttpOnly")
                .contains("SameSite=Strict")
                .contains("Path=/api/auth")
                .contains("Max-Age=" + REFRESH_COOKIE_MAX_AGE_SECONDS);
    }

    @Test
    void login_ShouldAnswerAnUnknownEmailExactlyLikeAWrongPassword() throws Exception {
        // Arrange: an existing user
        String email = newUniqueEmail();
        signUp(email);

        // Act: a wrong password for a real email, and an email that was never registered
        String wrongPasswordBody = logIn(email, "wrong-password1")
                .andExpect(status().isUnauthorized())
                .andReturn().getResponse().getContentAsString();
        String unknownEmailBody = logIn(newUniqueEmail(), TEST_PASSWORD)
                .andExpect(status().isUnauthorized())
                .andReturn().getResponse().getContentAsString();

        // Assert: the answers are identical, so the login form doesn't reveal which emails are registered
        assertThat(unknownEmailBody).isEqualTo(wrongPasswordBody);
    }

    // ---- Refresh ----------------------------------------------------------------------------------------------

    @Test
    void refresh_ShouldReturnAnAccessTokenThatOpensProtectedEndpoints() throws Exception {
        // Arrange: a signed-up user and their refresh cookie
        UserSession user = signUp(newUniqueEmail());

        // Act: get a new access token through refresh, then use it on a protected endpoint
        String accessToken = readAccessToken(refresh(user.refreshCookie()).andExpect(status().isOk()));

        // Assert: the token is accepted and belongs to the same user
        getCurrentUser(accessToken)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(user.email()));
    }

    @Test
    void refresh_ShouldRevokeTheWholeSession_WhenAnOldRefreshTokenIsReused() throws Exception {
        // Arrange: a new user, which starts a session with its first refresh token
        Cookie firstRefreshCookie = signUp(newUniqueEmail()).refreshCookie();

        // Act + Assert 1: refreshing works and replaces the token with a new one
        Cookie secondRefreshCookie = readRefreshCookie(refresh(firstRefreshCookie).andExpect(status().isOk()));
        assertThat(secondRefreshCookie.getValue()).isNotEqualTo(firstRefreshCookie.getValue());

        // Act + Assert 2: the old token is used again, so it's treated as stolen
        refresh(firstRefreshCookie).andExpect(status().isUnauthorized());

        // Act + Assert 3: the whole session was revoked, so even the newest token no longer works
        refresh(secondRefreshCookie).andExpect(status().isUnauthorized());
    }

    @Test
    void refresh_ShouldReturn401_WhenNoRefreshCookieIsSent() throws Exception {
        mockMvc.perform(post("/api/auth/refresh"))
                .andExpect(status().isUnauthorized());
    }

    // ---- Ending sessions --------------------------------------------------------------------------------------

    @Test
    void logout_ShouldEndTheSessionAndTellTheBrowserToDeleteTheCookie() throws Exception {
        // Arrange: a signed-up user
        Cookie refreshCookie = signUp(newUniqueEmail()).refreshCookie();

        // Act: log out with that cookie
        String setCookieHeader = mockMvc.perform(post("/api/auth/logout").cookie(refreshCookie))
                .andExpect(status().isNoContent())
                .andReturn().getResponse().getHeader(HttpHeaders.SET_COOKIE);

        // Assert: the browser is told to delete the cookie, and the session is gone in Redis
        assertThat(setCookieHeader)
                .startsWith(RefreshTokenCookie.NAME + "=")
                .contains("Max-Age=0");
        refresh(refreshCookie).andExpect(status().isUnauthorized());
    }

    @Test
    void changePassword_ShouldEndOtherSessions_AndKeepTheChangingDeviceSignedIn() throws Exception {
        // Arrange: the same user signed in on two devices
        UserSession laptop = signUp(newUniqueEmail());
        UserSession phone = logInSession(laptop.email());

        // Act: change the password on the laptop
        String changePasswordJson = """
                {
                  "currentPassword": "%s",
                  "newPassword": "newPassword456",
                  "confirmNewPassword": "newPassword456"
                }
                """.formatted(TEST_PASSWORD);
        Cookie laptopNewRefreshCookie = readRefreshCookie(mockMvc.perform(patch("/api/user/change-password")
                        .header(HttpHeaders.AUTHORIZATION, bearer(laptop.accessToken()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(changePasswordJson))
                .andExpect(status().isOk()));

        // Assert: every old session is over, and the laptop's new one works
        refresh(phone.refreshCookie()).andExpect(status().isUnauthorized());
        refresh(laptop.refreshCookie()).andExpect(status().isUnauthorized());
        refresh(laptopNewRefreshCookie).andExpect(status().isOk());
    }

    @Test
    void deleteAccount_ShouldEndAllSessions_AndRejectTheStillValidAccessToken() throws Exception {
        // Arrange: a signed-up user
        UserSession user = signUp(newUniqueEmail());

        // Act: delete the account
        mockMvc.perform(delete("/api/user/delete")
                        .header(HttpHeaders.AUTHORIZATION, bearer(user.accessToken())))
                .andExpect(status().isOk());

        // Assert: the session was revoked after the deletion committed, and the access token,
        // which hasn't expired yet, is rejected with 401 (not 500) because its user is gone
        refresh(user.refreshCookie()).andExpect(status().isUnauthorized());
        getCurrentUser(user.accessToken()).andExpect(status().isUnauthorized());
    }

    // ---- Helpers ----------------------------------------------------------------------------------------------

    /** What the client holds after signing in: the access token and the refresh cookie. */
    private record UserSession(String email, String accessToken, Cookie refreshCookie) {
    }

    /** A different email for every call, so tests don't depend on each other's data. */
    private static String newUniqueEmail() {
        return "auth-test-" + UUID.randomUUID() + "@example.com";
    }

    /** Signs up a user with {@link #TEST_PASSWORD} and returns the new session. */
    private UserSession signUp(String email) throws Exception {
        String signupJson = """
                {
                  "firstName": "Test",
                  "lastName": "User",
                  "email": "%s",
                  "password": "%s",
                  "confirmPassword": "%s"
                }
                """.formatted(email, TEST_PASSWORD, TEST_PASSWORD);

        ResultActions signupResponse = mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signupJson))
                .andExpect(status().isOk());

        return new UserSession(email, readAccessToken(signupResponse), readRefreshCookie(signupResponse));
    }

    /** Logs an existing user in with {@link #TEST_PASSWORD}, starting a second session (another device). */
    private UserSession logInSession(String email) throws Exception {
        ResultActions loginResponse = logIn(email, TEST_PASSWORD).andExpect(status().isOk());
        return new UserSession(email, readAccessToken(loginResponse), readRefreshCookie(loginResponse));
    }

    private ResultActions logIn(String email, String password) throws Exception {
        String loginJson = """
                { "email": "%s", "password": "%s" }
                """.formatted(email, password);

        return mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson));
    }

    private ResultActions refresh(Cookie refreshCookie) throws Exception {
        return mockMvc.perform(post("/api/auth/refresh").cookie(refreshCookie));
    }

    private ResultActions getCurrentUser(String accessToken) throws Exception {
        return mockMvc.perform(get("/api/user/me").header(HttpHeaders.AUTHORIZATION, bearer(accessToken)));
    }

    private static String bearer(String accessToken) {
        return "Bearer " + accessToken;
    }

    /** Reads {@code accessToken} from an {@code AuthResponseDto} JSON body. */
    private static String readAccessToken(ResultActions authResponse) throws Exception {
        String responseBody = authResponse.andReturn().getResponse().getContentAsString();
        return JsonPath.read(responseBody, "$.accessToken");
    }

    /** Reads the refresh cookie the response set, failing the test if there is none. */
    private static Cookie readRefreshCookie(ResultActions response) {
        Cookie refreshCookie = response.andReturn().getResponse().getCookie(RefreshTokenCookie.NAME);
        assertThat(refreshCookie).as("refresh cookie in the response").isNotNull();
        return refreshCookie;
    }
}

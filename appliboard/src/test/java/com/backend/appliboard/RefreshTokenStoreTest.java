package com.backend.appliboard;

import com.backend.appliboard.features.user.UserDeletedEvent;
import com.backend.appliboard.infrastructures.security.RefreshTokenStore;
import com.backend.appliboard.infrastructures.security.RotatedRefreshToken;
import com.backend.appliboard.shared.exceptions.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.script.RedisScript;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("unchecked")
public class RefreshTokenStoreTest {

    private static final UUID USER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final String FAMILY_ID = "22222222-2222-2222-2222-222222222222";
    private static final String SECRET = "current-secret";
    private static final String REFRESH_TOKEN = FAMILY_ID + "." + SECRET;
    private static final String FAMILY_KEY = "appliboard::refresh::" + FAMILY_ID;
    private static final String USER_SESSIONS_KEY = "appliboard::user-sessions::" + USER_ID;
    private static final long TTL_MS = 604_800_000L;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Mock
    private SetOperations<String, String> setOperations;

    private RefreshTokenStore refreshTokenStore;

    @BeforeEach
    public void setUp() {
        refreshTokenStore = new RefreshTokenStore(redisTemplate, TTL_MS);
    }

    @Test
    public void createRefreshToken_ShouldStoreOnlyTheSecretsHashWithTtl_AndRegisterTheSession() {
        String token = refreshTokenStore.createRefreshToken(USER_ID);

        ArgumentCaptor<List<String>> keysCaptor = ArgumentCaptor.forClass(List.class);
        ArgumentCaptor<String> sessionCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> familyIdCaptor = ArgumentCaptor.forClass(String.class);
        verify(redisTemplate).execute(any(RedisScript.class), keysCaptor.capture(),
                sessionCaptor.capture(), eq(String.valueOf(TTL_MS)), familyIdCaptor.capture());

        String familyId = familyIdCaptor.getValue();
        String secret = token.substring(familyId.length() + 1);
        assertEquals(familyId + "." + secret, token);
        assertEquals(List.of("appliboard::refresh::" + familyId, USER_SESSIONS_KEY), keysCaptor.getValue());
        assertEquals(USER_ID + ":" + hashSecret(secret), sessionCaptor.getValue());
    }

    @Test
    public void createRefreshToken_ShouldStartADifferentSessionEachTime() {
        assertNotEquals(refreshTokenStore.createRefreshToken(USER_ID), refreshTokenStore.createRefreshToken(USER_ID));
    }

    @Test
    public void rotateRefreshToken_ShouldReturnANewTokenInTheSameFamily_WhenTokenIsCurrent() throws UnauthorizedException {
        when(redisTemplate.execute(any(RedisScript.class), anyList(), any(), any())).thenReturn(USER_ID.toString());

        RotatedRefreshToken rotated = refreshTokenStore.rotateRefreshToken(REFRESH_TOKEN);

        assertEquals(USER_ID, rotated.userId());
        assertTrue(rotated.token().startsWith(FAMILY_ID + "."));
        assertNotEquals(REFRESH_TOKEN, rotated.token());
        String newSecret = rotated.token().substring(FAMILY_ID.length() + 1);
        verify(redisTemplate).execute(any(RedisScript.class), eq(List.of(FAMILY_KEY)), eq(hashSecret(SECRET)), eq(hashSecret(newSecret)));
    }

    @ParameterizedTest(name = "script result {0}")
    @ValueSource(strings = {"MISSING", "REUSED"})
    public void rotateRefreshToken_ShouldThrowUnauthorized_WhenSessionIsGoneOrTokenWasReused(String scriptResult) {
        when(redisTemplate.execute(any(RedisScript.class), anyList(), any(), any())).thenReturn(scriptResult);

        assertThrows(UnauthorizedException.class, () -> refreshTokenStore.rotateRefreshToken(REFRESH_TOKEN));
    }

    @ParameterizedTest(name = "token \"{0}\"")
    @NullAndEmptySource
    @ValueSource(strings = {"no-separator", "not-a-uuid.secret", FAMILY_ID + ".", ".secret"})
    public void rotateRefreshToken_ShouldThrowUnauthorizedWithoutCallingRedis_WhenTokenIsMalformed(String malformedToken) {
        assertThrows(UnauthorizedException.class, () -> refreshTokenStore.rotateRefreshToken(malformedToken));

        verifyNoInteractions(redisTemplate);
    }

    @Test
    public void revokeRefreshToken_ShouldDeleteTheSessionAndUnregisterIt_WhenSessionExists() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.opsForSet()).thenReturn(setOperations);
        when(valueOperations.getAndDelete(FAMILY_KEY)).thenReturn(USER_ID + ":" + hashSecret(SECRET));

        refreshTokenStore.revokeRefreshToken(REFRESH_TOKEN);

        verify(setOperations).remove(USER_SESSIONS_KEY, FAMILY_ID);
    }

    @Test
    public void revokeRefreshToken_ShouldDoNothingElse_WhenSessionIsAlreadyGone() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.getAndDelete(FAMILY_KEY)).thenReturn(null);

        refreshTokenStore.revokeRefreshToken(REFRESH_TOKEN);

        verify(redisTemplate, never()).opsForSet();
    }

    @Test
    public void revokeRefreshToken_ShouldIgnoreMalformedToken() {
        refreshTokenStore.revokeRefreshToken("garbage");

        verifyNoInteractions(redisTemplate);
    }

    @Test
    public void revokeAllRefreshTokens_ShouldDeleteEverySessionAndTheSessionIndex() {
        String otherFamilyId = "33333333-3333-3333-3333-333333333333";
        when(redisTemplate.opsForSet()).thenReturn(setOperations);
        when(setOperations.members(USER_SESSIONS_KEY)).thenReturn(Set.of(FAMILY_ID, otherFamilyId));

        refreshTokenStore.revokeAllRefreshTokens(USER_ID);

        ArgumentCaptor<Collection<String>> deletedKeysCaptor = ArgumentCaptor.forClass(Collection.class);
        verify(redisTemplate).delete(deletedKeysCaptor.capture());
        assertEquals(
                Set.of(USER_SESSIONS_KEY, FAMILY_KEY, "appliboard::refresh::" + otherFamilyId),
                Set.copyOf(deletedKeysCaptor.getValue()));
    }

    @Test
    public void onUserDeleted_ShouldRevokeAllSessions() {
        when(redisTemplate.opsForSet()).thenReturn(setOperations);
        when(setOperations.members(USER_SESSIONS_KEY)).thenReturn(Set.of(FAMILY_ID));

        refreshTokenStore.onUserDeleted(new UserDeletedEvent(USER_ID));

        verify(redisTemplate).delete(List.of(USER_SESSIONS_KEY, FAMILY_KEY));
    }

    @Test
    public void onUserDeleted_ShouldNotThrow_WhenRedisIsDown() {
        when(redisTemplate.opsForSet()).thenThrow(new RedisConnectionFailureException("Redis is down"));

        assertDoesNotThrow(() -> refreshTokenStore.onUserDeleted(new UserDeletedEvent(USER_ID)));
    }

    @Test
    public void revokeAllRefreshTokens_ShouldPropagateRedisErrors_SoCallersFailClosed() {
        when(redisTemplate.opsForSet()).thenThrow(new RedisConnectionFailureException("Redis is down"));

        assertThrows(RedisConnectionFailureException.class, () -> refreshTokenStore.revokeAllRefreshTokens(USER_ID));
    }

    /** Test oracle for the stored hash: SHA-256, base64url without padding. */
    private static String hashSecret(String secret) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(secret.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}

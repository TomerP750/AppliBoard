const ACCESS_TOKEN_STORAGE_KEY = "accessToken";

/**
 * Keeps the JWT access token in localStorage so a reload or a new tab stays
 * logged in until the token expires. There is no refresh token: once the
 * backend rejects the token, the user has to log in again.
 */
export const tokenStore = {
    get: () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
    set: (token: string) => localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token),
    clear: () => localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY),
};

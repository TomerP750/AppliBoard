const SESSION_HINT_STORAGE_KEY = "hasSession";

/**
 * Remembers that this browser was left in a logged-in state.
 *
 * The refresh token lives in an httpOnly cookie, so JavaScript cannot tell
 * whether a session exists. Without a hint, the app has to call the refresh
 * endpoint on every cold start just to find out, which means an anonymous
 * visitor to a public page pays for a request that is guaranteed to 401.
 *
 * This flag carries no credentials: it only says "a refresh attempt is worth
 * making". It can be stale (the refresh token may have expired or been
 * revoked server side), so a rejected refresh clears it again.
 */
export const sessionHint = {
    exists: () => localStorage.getItem(SESSION_HINT_STORAGE_KEY) === "true",
    set: () => localStorage.setItem(SESSION_HINT_STORAGE_KEY, "true"),
    clear: () => localStorage.removeItem(SESSION_HINT_STORAGE_KEY),
};

import authService from "./authService";
import { tokenStore } from "../contexts/tokenStore";
import { sessionHint } from "../contexts/sessionHint";
import type { AuthResponseDto } from "../models/AuthResponseDto";

/** Name of the browser lock that lets only one tab refresh at a time. */
const REFRESH_LOCK_NAME = "appliboard-refresh-session";

/**
 * The refresh that is running right now, or `null` when none is.
 * Every caller that needs a refresh while one is running gets this same promise.
 */
let refreshInFlight: Promise<AuthResponseDto> | null = null;

/**
 * Gets a new access token from the refresh cookie and stores it.
 *
 * Only one refresh runs at a time. This matters: the backend rotates the
 * refresh token on every use, and if it sees the same token twice it treats it
 * as stolen and ends the session. So when several requests fail at once, they
 * all wait for one shared refresh instead of each sending their own.
 *
 * @throws the request error when the session can't be refreshed (the user must log in again).
 */
export function refreshSession(): Promise<AuthResponseDto> {
    if (refreshInFlight === null) {
        refreshInFlight = requestNewSession().finally(() => {
            refreshInFlight = null;
        });
    }
    return refreshInFlight;
}

async function requestNewSession(): Promise<AuthResponseDto> {
    try {
        const authResponse = await withRefreshLock(() => authService.refresh());
        tokenStore.set(authResponse.accessToken);
        sessionHint.set();
        return authResponse;
    } catch (error) {
        tokenStore.clear();
        sessionHint.clear();
        throw error;
    }
}

/**
 * Runs the task while holding a lock shared by all tabs of this site, so two
 * tabs never send the same refresh cookie at the same moment. The second tab
 * waits, then sends the cookie the first tab already rotated.
 */
async function withRefreshLock<T>(task: () => Promise<T>): Promise<T> {
    if (!("locks" in navigator)) {
        return task();
    }
    return await navigator.locks.request(REFRESH_LOCK_NAME, task);
}

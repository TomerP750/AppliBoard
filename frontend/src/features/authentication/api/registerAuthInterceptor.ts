import axios, { type InternalAxiosRequestConfig } from "axios";
import authService from "./authService";
import { tokenStore } from "../contexts/tokenStore";

/**
 * An axios request config tagged with `hasBeenRetried` so a request that has
 * already been replayed after a token refresh is never retried a second time.
 */
type RetriableRequestConfig = InternalAxiosRequestConfig & {
    hasBeenRetried?: boolean;
};

/**
 * Installs a global axios response interceptor that transparently recovers from
 * an expired access token.
 *
 * When a protected request fails with 401, it refreshes the access token once,
 * replays the original request with the new token, and returns its result so
 * callers never observe the expiry. If the refresh itself fails, the stored
 * token is cleared and `onSessionExpired` is invoked so the caller can tear
 * down its own session state (e.g. clear the cached user).
 *
 * Guards that keep this from looping forever:
 * - Only 401 responses are handled; everything else is rejected untouched.
 * - Requests to `/api/auth/*` (including the refresh call) are ignored, so a
 *   failing refresh cannot trigger another refresh.
 * - Each request is retried at most once, tracked via `hasBeenRetried`.
 *
 * @param onSessionExpired Called when the session cannot be recovered.
 * @returns A cleanup function that removes the interceptor.
 */
export function registerAuthInterceptor(onSessionExpired: () => void) {
    const interceptorId = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const failedRequest = error.config as RetriableRequestConfig | undefined;
            const isUnauthorized = axios.isAxiosError(error) && error.response?.status === 401;
            const isAuthEndpoint = failedRequest?.url?.includes("/api/auth/") ?? false;

            if (!isUnauthorized || !failedRequest || failedRequest.hasBeenRetried || isAuthEndpoint) {
                return Promise.reject(error);
            }

            failedRequest.hasBeenRetried = true;

            try {
                const { accessToken } = await authService.refreshToken();
                tokenStore.set(accessToken);
                failedRequest.headers.Authorization = `Bearer ${accessToken}`;
                return await axios(failedRequest);
            } catch (refreshError) {
                tokenStore.clear();
                onSessionExpired();
                return Promise.reject(refreshError);
            }
        },
    );

    return () => axios.interceptors.response.eject(interceptorId);
}

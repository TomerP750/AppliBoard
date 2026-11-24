import axios from "axios";
import { tokenStore } from "../contexts/tokenStore";

/**
 * Installs a global axios response interceptor that ends the session when the
 * backend rejects the access token (expired or invalid). There is no refresh
 * token, so a 401 on a protected request means the user must log in again.
 *
 * Requests to `/api/auth/*` are ignored, so a failed login or signup shows its
 * own error instead of being treated as an expired session.
 *
 * @param onSessionExpired Called after the stored token is cleared.
 * @returns A cleanup function that removes the interceptor.
 */
export function registerAuthInterceptor(onSessionExpired: () => void) {
    const interceptorId = axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (isRejectedSession(error)) {
                tokenStore.clear();
                onSessionExpired();
            }
            return Promise.reject(error);
        },
    );

    return () => axios.interceptors.response.eject(interceptorId);
}

function isRejectedSession(error: unknown): boolean {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        return false;
    }
    const isAuthEndpoint = error.config?.url?.includes("/api/auth/") ?? false;
    return !isAuthEndpoint;
}

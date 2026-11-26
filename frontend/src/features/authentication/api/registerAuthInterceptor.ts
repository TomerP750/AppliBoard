import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "../contexts/tokenStore";
import { refreshSession } from "./refreshSession";

/** A request config that remembers whether it was already retried after a refresh. */
type RetriableRequestConfig = InternalAxiosRequestConfig & {
    hasRetriedAfterRefresh?: boolean;
};

/**
 * Installs a global axios response interceptor that handles an expired access token.
 *
 * When a protected request gets a 401:
 * 1. It refreshes the session once (requests that fail together share that one refresh).
 * 2. It sends the failed request again with the new access token.
 * 3. If the refresh fails, or the retried request still gets a 401, the session
 *    is over: `onSessionExpired` is called and the error is passed on.
 *
 * Requests to `/api/auth/*` are ignored, so a failed login shows its own error
 * and a failed refresh can't trigger another refresh.
 *
 * @param onSessionExpired Called after the access token is cleared.
 * @returns A cleanup function that removes the interceptor.
 */
export function registerAuthInterceptor(onSessionExpired: () => void) {
    const interceptorId = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (!isExpiredAccessToken(error)) {
                return Promise.reject(error);
            }

            const failedRequest = error.config as RetriableRequestConfig;
            if (failedRequest.hasRetriedAfterRefresh) {
                return endSession(error);
            }
            failedRequest.hasRetriedAfterRefresh = true;

            if (wasSentWithCurrentToken(failedRequest)) {
                try {
                    await refreshSession();
                } catch {
                    return endSession(error);
                }
            }

            // The request interceptor in main.tsx puts the new token in the Authorization header.
            return axios(failedRequest);
        },
    );

    function endSession(error: unknown) {
        tokenStore.clear();
        onSessionExpired();
        return Promise.reject(error);
    }

    return () => axios.interceptors.response.eject(interceptorId);
}

/** A 401 from a protected endpoint, which means the access token expired or is invalid. */
function isExpiredAccessToken(error: unknown): error is AxiosError & { config: InternalAxiosRequestConfig } {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
        return false;
    }
    const isAuthEndpoint = error.config.url?.includes("/api/auth/") ?? false;
    return !isAuthEndpoint;
}

/**
 * Whether the request used the token we have now.
 * If not, another request already refreshed while this one was on its way,
 * so it only needs to be sent again, not refreshed again.
 */
function wasSentWithCurrentToken(request: InternalAxiosRequestConfig): boolean {
    const currentToken = tokenStore.get();
    if (currentToken === null) {
        return true;
    }
    return request.headers.Authorization === `Bearer ${currentToken}`;
}

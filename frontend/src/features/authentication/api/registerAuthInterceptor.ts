import axios, { type InternalAxiosRequestConfig } from "axios";
import authService from "./authService";
import { tokenStore } from "../contexts/tokenStore";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
    hasBeenRetried?: boolean;
};

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

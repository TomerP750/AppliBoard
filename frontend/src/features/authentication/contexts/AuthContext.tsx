import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { LoginRequestDto } from "../models/LoginRequestDto";
import type { SignupRequestDto } from "../models/SignupRequestDto";
import authService from "../api/authService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthResponseDto } from "../models/AuthResponseDto";
import type { UserDto } from "../../../shared/models/UserDto";
import { tokenStore } from "./tokenStore";
import { registerAuthInterceptor } from "../api/registerAuthInterceptor";
import userService from "../../dashboard/settings/api/userService";
import axios from "axios";

const USER_QUERY_KEY = ["auth", "user"] as const;

type AuthState = {
    user: UserDto | null;
    /** True while the initial user fetch (from the stored token) is in flight. */
    isLoading: boolean;
}

type AuthContextValues = AuthState & {
    login: (dto: LoginRequestDto) => Promise<void>;
    signup: (dto: SignupRequestDto) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValues | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

    const queryClient = useQueryClient();

    /**
     * Whether a token was saved when the app started, read once on mount. Later
     * logins seed the cache directly, so this only decides if the app starts by
     * trying to restore a session.
     */
    const [hasStoredToken] = useState(() => tokenStore.get() !== null);

    /**
     * Restores the user from the stored token when the app starts, so a reload
     * or a new tab keeps the session until the token expires.
     * Login/signup seed this same cache key, so consumers read one source of truth.
     *
     * A 401 means the stored token expired or is invalid: the auth interceptor
     * clears it, and the user starts logged out.
     */
    const { data: user = null, isLoading } = useQuery<UserDto | null>({
        queryKey: USER_QUERY_KEY,
        queryFn: async () => {
            try {
                return await userService.me();
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    return null;
                }
                throw error;
            }
        },
        enabled: hasStoredToken,
        retry: false,
        staleTime: Infinity,
    });

    useEffect(() => {
        return registerAuthInterceptor(() => {
            queryClient.setQueryData(USER_QUERY_KEY, null);
        });
    }, [queryClient]);

    /**
     * Persists the returned JWT and seeds the user cache from an auth response,
     * keeping login and signup in sync.
     */
    const applyAuthResponse = useCallback(({ accessToken, userDto }: AuthResponseDto) => {
        tokenStore.set(accessToken);
        queryClient.setQueryData(USER_QUERY_KEY, userDto);
    }, [queryClient]);

    /**
     * Authenticates the user, stores the returned JWT, and seeds the user cache.
     */
    const login = useCallback(async (dto: LoginRequestDto) => {
        applyAuthResponse(await authService.login(dto));
    }, [applyAuthResponse]);

    /**
     * Creates a new account, stores the returned JWT, and seeds the user cache.
     */
    const signup = useCallback(async (dto: SignupRequestDto) => {
        applyAuthResponse(await authService.signup(dto));
    }, [applyAuthResponse]);

    /**
     * Logs the user out locally by removing the token and clearing cached user data.
     */
    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            tokenStore.clear();
            queryClient.setQueryData(USER_QUERY_KEY, null);
        }
    }, [queryClient]);

    const ctx = useMemo<AuthContextValues>(
        () => ({ user, isLoading, login, signup, logout }),
        [user, isLoading, login, signup, logout],
    );

    return (
        <AuthContext.Provider value={ctx}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

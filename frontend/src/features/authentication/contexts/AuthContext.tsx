import { createContext, useContext, useEffect } from "react";
import type { LoginRequestDto } from "../models/LoginRequestDto";
import type { SignupRequestDto } from "../models/SignupRequestDto";
import authService from "../api/authService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthResponseDto } from "../models/AuthResponseDto";
import userService from "../../dashboard/settings/api/userService";
import type { UserDto } from "../../../shared/models/UserDto";

type AuthState = {
    user: UserDto | null;
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
     * Loads the current user from the saved token when the app starts.
     * Login/signup seed this same cache key, so consumers can read one source of truth.
     */
    const { data: user = null, isError } = useQuery({
        queryKey: ["user"],
        queryFn: () => userService.me(),
        enabled: Boolean(localStorage.getItem("token")),
        retry: false,
    });

    /**
     * Clears auth data when the saved token can no longer load the current userDto.
     */
    useEffect(() => {
        if (isError) {
            localStorage.removeItem("token");
            queryClient.clear();
        }
    }, [isError, queryClient]);

    /**
     * Authenticates the user, stores the returned JWT, and seeds the userDto cache.
     */
    const login = async (dto: LoginRequestDto) => {
        const response: AuthResponseDto = await authService.login(dto);
        queryClient.clear();
        localStorage.setItem("token", response.token);
        queryClient.setQueryData(["user"], response.userDto);
    };

    /**
     * Creates a new account, stores the returned JWT, and seeds the userDto cache.
     */
    const signup = async (dto: SignupRequestDto) => {
        const response: AuthResponseDto = await authService.signup(dto);
        queryClient.clear();
        localStorage.setItem("token", response.token);
        queryClient.setQueryData(["user"], response.userDto);
    }

    /**
     * Logs the user out locally by removing the token and clearing cached user data.
     */
    const logout = async () => {
        localStorage.removeItem("token");
        queryClient.clear();
    };

    const ctx = { user, login, signup, logout };

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

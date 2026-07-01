import { createContext, useContext, useState } from "react";
import type { UserDto } from "../../../shared/models/UserDto";
import type { LoginRequestDto } from "../models/LoginRequestDto";
import type { SignupRequestDto } from "../models/SignupRequestDto";

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
    
    const [user, setUser] = useState<UserDto | null>(null);

    const login = async (dto: LoginRequestDto) => {

    }

    const signup = async (dto: SignupRequestDto) => {

    }

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('token');
    }

    const ctx = { user, login, signup, logout };

    return <AuthContext.Provider value={ctx}>
        {children}
    </AuthContext.Provider>;

}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

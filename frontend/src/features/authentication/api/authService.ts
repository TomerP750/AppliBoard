import axios from "axios";
import { baseApiUrl } from "../../../shared/util/baseApi";
import type { LoginRequestDto } from "../models/LoginRequestDto";
import type { SignupRequestDto } from "../models/SignupRequestDto";
import type { AuthResponseDto } from "../models/AuthResponseDto";

class AuthService {

    async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
        return (await axios.post<AuthResponseDto>(`${baseApiUrl}/api/auth/login`, dto)).data;
    }

    async signup(dto: SignupRequestDto): Promise<AuthResponseDto> {
        return (await axios.post<AuthResponseDto>(`${baseApiUrl}/api/auth/signup`, dto)).data;
    }

    /** Sends the httpOnly refresh cookie and gets a new access token (the cookie is rotated too). */
    async refresh(): Promise<AuthResponseDto> {
        return (await axios.post<AuthResponseDto>(`${baseApiUrl}/api/auth/refresh`)).data;
    }

    async logout(): Promise<void> {
        await axios.post(`${baseApiUrl}/api/auth/logout`);
    }

} 

const authService = new AuthService();
export default authService;
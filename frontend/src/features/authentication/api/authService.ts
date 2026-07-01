import axios from "axios";
import { baseApiUrl } from "../../../shared/util/baseApi";
import type { LoginRequestDto } from "../models/LoginRequestDto";
import type { SignupRequestDto } from "../models/SignupRequestDto";

class AuthService {

    async login(dto: LoginRequestDto) {
        return (await axios.post(`${baseApiUrl}/api/auth/login`, dto)).data;
    }

    async signup(dto: SignupRequestDto) {
        return (await axios.post(`${baseApiUrl}/api/auth/signup`, dto)).data;
    }

} 

const authService = new AuthService();
export default authService;
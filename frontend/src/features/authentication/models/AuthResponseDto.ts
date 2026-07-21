import type { UserDto } from "../../../shared/models/UserDto";


export interface AuthResponseDto {
    accessToken: string;
    userDto: UserDto;
}
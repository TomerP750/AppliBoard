import type { UserDto } from "../../../shared/models/UserDto";


export interface AuthResponseDto {
    token: string;
    userDto: UserDto;
}
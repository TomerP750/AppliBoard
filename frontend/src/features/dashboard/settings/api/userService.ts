import type { ChangePasswordDto } from "../models/ChangePasswordDto";
import type { UpdateUserDto } from "../models/UpdateUserDto";


class UserService {

    async me() {
    }

    async allUsers(page: number = 0, size: number = 10) {
    }

    async updateUser(dto: UpdateUserDto) {
    }

    async deleteUser() {
    }

    async changePassword(dto: ChangePasswordDto) {
    }
}

const userService = new UserService();
export default userService;
import { baseApiUrl } from "../../../../shared/util/baseApi";
import type { ChangePasswordDto } from "../models/ChangePasswordDto";
import type { UpdateUserDto } from "../models/UpdateUserDto";
import axios from "axios";

class UserService {

    async me() {
        return (await axios.get(`${baseApiUrl}/api/user/me`)).data;
    }

    async allUsers(page: number = 0, size: number = 10) {
        return (await axios.get(`${baseApiUrl}/api/user/all?page=${page}&size=${size}`)).data;
    }
    async updateUser(dto: UpdateUserDto) {
        return (await axios.put(`${baseApiUrl}/api/user/update`, dto)).data;
    }   

    async deleteUser() {
        return (await axios.delete(`${baseApiUrl}/api/user/delete`)).data;
    }

    async changePassword(dto: ChangePasswordDto) {
        return (await axios.patch(`${baseApiUrl}/api/user/change-password`, dto)).data;
    }
}

const userService = new UserService();
export default userService;
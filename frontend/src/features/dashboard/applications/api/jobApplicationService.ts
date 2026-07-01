// dont add axios yet

import type { CreateJobApplicationDto } from "../models/CreateJobApplicationDto";
import { baseApiUrl } from "../../../../shared/util/baseApi";
import axios from "axios";

class JobApplicationService {

    async allJobApplications(page: number = 0, size: number = 10) {
        return (await axios.get(`${baseApiUrl}/api/ja?page=${page}&size=${size}`)).data;
    }

    async oneJobApplication(jobApplicationId: string) {
        return (await axios.get(`${baseApiUrl}/api/ja/${jobApplicationId}`)).data;
    }

    async createJobApplication(dto: CreateJobApplicationDto) {
        return (await axios.post(`${baseApiUrl}/api/ja/create`, dto)).data;
    }

    async deleteJobApplication(jobApplicationId: string) {
        return (await axios.delete(`${baseApiUrl}/api/ja/delete/${jobApplicationId}`)).data;
    }

    async toggleJobApplicationFavorite(jobApplicationId: string) {
        return (await axios.patch(`${baseApiUrl}/api/ja/toggle-favorite/${jobApplicationId}`)).data;
    }
}

const jobApplicationService = new JobApplicationService();
export default jobApplicationService;
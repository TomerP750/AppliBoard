import type { CreateJobApplicationDto } from "../models/CreateJobApplicationDto";
import { baseApiUrl } from "../../../../shared/util/baseApi";
import axios from "axios";
import type { UpdateJobApplicationDto } from "../models/UpdateJobApplicationDto";
import type { PageResponse } from "../../../../shared/models/PageResponse";
import type { JobApplicationDto } from "../models/JobApplicationDto";
import type { Position } from "../models/Position";
import type { Status } from "../models/Status";

export type AllJobApplicationsParams = {
    name?: string;
    statuses?: Status[];
    positions?: Position[];
    favorites?: boolean;
    sort?: "newest" | "oldest";
    page?: number;
    size?: number;
};

class JobApplicationService {

    async allJobApplications(params: AllJobApplicationsParams = {}): Promise<PageResponse<JobApplicationDto>> {
        return (await axios.get(`${baseApiUrl}/api/ja/all`, {
            params,
            paramsSerializer: {
                indexes: null,
            },
        })).data;
    }

    async oneJobApplication(jobApplicationId: string) {
        return (await axios.get(`${baseApiUrl}/api/ja/${jobApplicationId}`)).data;
    }

    async updateJobApplication(jobApplicationId: string, dto: UpdateJobApplicationDto) {
        return (await axios.put(`${baseApiUrl}/api/ja/update/${jobApplicationId}`, dto)).data;
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
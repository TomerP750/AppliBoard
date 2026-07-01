// dont add axios yet

import type { CreateJobApplicationDto } from "../models/CreateJobApplicationDto";
import { baseApiUrl } from "../../../../shared/util/baseApi";

class JobApplicationService {

    async allJobApplications(page: number = 0, size: number = 10) {

    }

    async oneJobApplication(jobApplicationId: string) {

    }

    async createJobApplication(dto: CreateJobApplicationDto) {

    }

    async deleteJobApplication(jobApplicationId: string) {

    }

    async toggleJobApplicationFavorite(jobApplicationId: string) {

    }
}

const jobApplicationService = new JobApplicationService();
export default jobApplicationService;
import axios from "axios";
import { baseApiUrl } from "../../../../shared/util/baseApi";

class ActivityService {

    async getActivities() {
        return (await axios.get(`${baseApiUrl}/api/activity`)).data;
    }

}

const activityService = new ActivityService();
export default activityService;
import type { Status } from "../../applications/models/Status";

    

export interface AnalyticsDto {
    
    id: string;
    totalApplicationsSent: number;
    countByStats: Record<Status, number>;

}
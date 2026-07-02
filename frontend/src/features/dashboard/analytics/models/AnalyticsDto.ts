import type { Status } from "../../applications/models/Status";

export type DayOfWeek =
    | "SUNDAY"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY";

export interface AnalyticsDto {

    totalApplicationsSent: number;
    weeklyApplicationsSent: number;
    countByStatus: Record<Status, number>;
    weeklyApplicationsByDay: Record<DayOfWeek, number>;
    
}
export enum ActivityType {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    DELETED = "DELETED",
}

export interface ActivityDto {
    id: string;
    message: string;
    activityType: ActivityType;
    createdAt: Date;
}
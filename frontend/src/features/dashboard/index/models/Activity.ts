export enum ActivityType {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
}

export interface ActivityDto {
    id: string;
    message: string;
    type: ActivityType;
    createdAt: Date;
}
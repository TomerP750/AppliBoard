export enum Status {
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
    IN_PROGRESS = "IN_PROGRESS",
}

export enum Position {
    FULLSTACK = "FULLSTACK",
    BACKEND = "BACKEND",
    FRONTEND = "FRONTEND",
    QA = "QA",
}

export interface JobApplicationDto {
    id: string;
    name: string;
    city: string;
    status: Status;
    position: Position;
    isFavorite: boolean;
    appliedAt: string;
}
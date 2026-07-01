import type { Status, Position } from "./JobApplicationDto";

export interface UpdateJobApplicationDto {
    name: string;
    city: string;
    status: Status;
    position: Position;
}
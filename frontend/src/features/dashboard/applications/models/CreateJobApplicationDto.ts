import type { Status, Position } from "./JobApplicationDto";


export interface CreateJobApplicationDto {
    name: string;
    city: string;
    status: Status;
    position: Position;
}
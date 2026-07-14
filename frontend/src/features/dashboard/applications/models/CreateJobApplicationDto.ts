import type { Position } from "./Position";
import type { Status } from "./Status";


export interface CreateJobApplicationDto {
    name: string;
    city: string;
    status: Status;
    position: Position;
    note: string;
}
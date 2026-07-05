import type { Position } from "./Position";
import type { Status } from "./Status";

export interface UpdateJobApplicationDto {
    name: string;
    city: string;
    status: Status;
    position: Position;
}
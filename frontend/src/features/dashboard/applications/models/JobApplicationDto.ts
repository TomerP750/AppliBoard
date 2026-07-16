import type { Position } from "./Position";
import type { Status } from "./Status";


export interface JobApplicationDto {
    id: string;
    name: string;
    city: string;
    status: Status;
    position: Position;
    isFavorite: boolean;
    appliedAt: string;
    note: string;
    isStale: boolean;
}
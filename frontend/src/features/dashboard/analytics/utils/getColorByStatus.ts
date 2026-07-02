import { Status } from "../../applications/models/Status";

export function getColorByStatus(status: Status) {
    switch (status) {
        case Status.PENDING:
            return "amber";
        case Status.IN_PROGRESS:
            return "sky";
        case Status.ACCEPTED:
            return "green";
        case Status.REJECTED:
            return "red";
        default:
            return "blue";
    }
}

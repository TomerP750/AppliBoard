import { Status } from "../../applications/models/Status";
import { Loader2 } from "lucide-react";
import { ActivityIcon } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { XCircle } from "lucide-react";
import { Briefcase } from "lucide-react";

export function getIconByStatus(status: Status) {
    switch (status) {
        case Status.PENDING:
            return Loader2;
        case Status.IN_PROGRESS:
            return ActivityIcon;
        case Status.ACCEPTED:
            return CheckCircle;
        case Status.REJECTED:
            return XCircle;
        default:
            return Briefcase;
    }
}
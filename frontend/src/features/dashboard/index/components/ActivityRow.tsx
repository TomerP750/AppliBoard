import type { ActivityDto } from "../models/Activity";

interface ActivityRowProps {
    activity: ActivityDto;
}

export function ActivityRow({ activity }: ActivityRowProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{activity.message}</span>
            </div>
        </div>
    );
}

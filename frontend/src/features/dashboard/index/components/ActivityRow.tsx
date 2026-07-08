import { timeAgo } from "../../../../shared/util/timeAgo";
import type { ActivityDto } from "../models/ActivityDto";
import { getIconFromActivityType } from "../utils/getIconFromActivityType";

interface ActivityRowProps {
    activity: ActivityDto;
}

export function ActivityRow({ activity }: ActivityRowProps) {
    return (
        <div className="flex items-center justify-between gap-2 dark:text-white">
            <div className="inline-flex items-center gap-2 cursor-default text-sm font-medium">
                {getIconFromActivityType(activity.activityType)}
                <span className="text-zinc-900 dark:text-zinc-50 hover:underline">{activity.message}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                {timeAgo(new Date(activity.createdAt))}
            </p>
        </div>
    );
}

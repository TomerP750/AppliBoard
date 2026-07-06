import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon, HistoryIcon } from "lucide-react";
import { Button } from "../../../../shared/ui/Button";
import activityService from "../api/activityService";
import { ActivityRow } from "./ActivityRow";

export function ActivitySection() {

    const { data: activities } = useQuery({
        queryKey: ["activities"],
        queryFn: () => activityService.getActivities(),
        staleTime: 1000 * 60 * 1
    });

    const activitiesList = activities?.content.slice(0, 8) ?? [];

    return (
        <section className="px-5 py-5 h-80 bg-white dark:bg-[#0d111d] rounded-xl border border-black/10 dark:border-white/10">
            <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-5">
                <h2 className="inline-flex items-center gap-2 text-lg font-medium dark:text-white">
                    <HistoryIcon className="w-5 h-5" />
                    Recent Activity
                </h2>
                <Button
                    rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                    variant="ghost"
                    className="text-indigo-400! hover:underline hover:bg-transparent!">View All</Button>
            </div>
            {activitiesList.length === 0 ? (
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No Recent Activity</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {activitiesList?.map((activity) => (
                        <ActivityRow key={activity.id} activity={activity}  />
                    ))}
                </div>
            )}
        </section>
    )
}
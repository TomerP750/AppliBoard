import { BarChart3, Briefcase, ClockIcon, Loader2 } from "lucide-react";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { StatCard } from "../components/StatCard";
import { WeeklySentChart } from "../components/WeeklySentChart";
import { Status } from "../../applications/models/Status";
import { useQuery } from "@tanstack/react-query";
import analyticsService from "../api/analyticsService";
import type { AnalyticsDto } from "../models/AnalyticsDto";
import { toTitleCase } from "../../../../shared/util/toTitleCase";
import { getIconByStatus } from "../utils/getIconByStatus";
import { getColorByStatus } from "../utils/getColorByStatus";


export default function AnalyticsPage() {

    const { data: analytics, isLoading } = useQuery({
        queryKey: ["analytics"],
        queryFn: () => analyticsService.getAnalytics(),
        staleTime: 10 * 60 * 1000,
    });

    if (isLoading || !analytics) return (
    <div className="flex flex-col justify-center items-center h-screen text-white">
        <Loader2 className="animate-spin" />
        <span className="text-sm font-medium">Loading...</span>
    </div>
    );

    const { totalApplicationsSent, weeklyApplicationsByDay, weeklyApplicationsSent, countByStatus }: AnalyticsDto = analytics;

    return (
        <section className="min-h-screen p-6 bg-zinc-100 dark:bg-dark-background">

            <DashboardHeader Icon={BarChart3} title={"Analytics"} />

            <section className="max-w-8xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">

                <StatCard title="Applications" value={totalApplicationsSent} color="blue" icon={Briefcase} /> 
            
                {Object.entries(countByStatus).map(([status, count]) => (
                    <StatCard
                        key={status}
                        title={toTitleCase(status)}
                        value={count}
                        color={getColorByStatus(status as Status)}
                        icon={getIconByStatus(status as Status)}
                    />
                ))}

            </section>

            <section className="max-w-8xl w-full grid grid-cols-1 gap-4 mt-4 lg:mt-6 dark:text-white">
                <span className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        <ClockIcon className="w-5 h-5" /> Applications sent this week:
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {weeklyApplicationsSent}
                        </span>
                    </h2>
                </span>
                <WeeklySentChart weeklyApplicationsByDay={weeklyApplicationsByDay}  />
            </section>


        </section>
    )
}



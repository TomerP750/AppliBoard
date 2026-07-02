import { ActivityIcon, BarChart3, Briefcase, CheckCircle, Loader2, XCircle } from "lucide-react";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { StatCard } from "../components/StatCard";
import { WeeklySentChart } from "../components/WeeklySentChart";
import { Status } from "../../applications/models/Status";
import { useQuery } from "@tanstack/react-query";
import analyticsService from "../api/analyticsService";
import type { AnalyticsDto } from "../models/AnalyticsDto";


export function AnalyticsPage() {

    const { data: analytics, isLoading } = useQuery({
        queryKey: ["analytics"],
        queryFn: () => analyticsService.getAnalytics(),
    });

    if (isLoading || !analytics) return (
    <div className="flex flex-col justify-center items-center h-screen">
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
                        title={status}
                        value={count}
                        color={getColorByStatus(status as Status)}
                        icon={getIconByStatus(status as Status)}
                    />
                ))}

            </section>


            <section className="max-w-5xl w-full grid grid-cols-1 gap-4 mt-4 lg:mt-6 dark:text-white">
                <span className="text-sm font-medium">Total Applications Sent This Week: {weeklyApplicationsSent}</span>
                <WeeklySentChart weeklyApplicationsByDay={weeklyApplicationsByDay}  />
            </section>


        </section>
    )
}

function getColorByStatus(status: Status) {
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

function getIconByStatus(status: Status) {
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
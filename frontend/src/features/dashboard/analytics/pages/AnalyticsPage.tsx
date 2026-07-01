import { ActivityIcon, BarChart3, Briefcase, CheckCircle, Loader2, XCircle } from "lucide-react";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { StatCard } from "../components/StatCard";
import { WeeklySentChart } from "../components/WeeklySentChart";


export function AnalyticsPage() {

    return (
        <section className="min-h-screen p-6 bg-zinc-100 dark:bg-dark-background">

            <DashboardHeader Icon={BarChart3} title={"Analytics"} />

            <section className="max-w-8xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">

                <StatCard title="Applications" value={24} color="blue" icon={Briefcase} />
                <StatCard title="Interviews" value={6} color="amber" icon={ActivityIcon} />
                <StatCard title="In Progress" value={1} color="sky" icon={Loader2} />
                <StatCard title="Offers" value={2} color="green" icon={CheckCircle} />
                <StatCard title="Rejections" value={5} color="red" icon={XCircle} />
                
            </section>


            <section className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 lg:mt-6">
                <WeeklySentChart />
                <WeeklySentChart />
            </section>


        </section>
    )
}
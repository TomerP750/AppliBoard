import { Briefcase } from "lucide-react";
import { DashboardHeader } from "../../layout/DashboardHeader";


export function ApplicationsPage() {
    return (
        <section className="h-screen p-6">

            <DashboardHeader Icon={Briefcase} title={"Your Applications"} />

        </section>
    )
}
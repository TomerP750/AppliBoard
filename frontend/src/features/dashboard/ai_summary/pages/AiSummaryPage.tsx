import { WandSparkles } from "lucide-react";
import { DashboardHeader } from "../../layout/dashboard_header/DashboardHeader"


export function AiSummaryPage() {
    return (
        <section className="min-h-screen p-6 pb-24 md:pb-6 bg-zinc-100 dark:bg-dark-background">
            <DashboardHeader Icon={WandSparkles} title="AI Summary" />
            <h1>AI Summary</h1>
        </section>
    );
}
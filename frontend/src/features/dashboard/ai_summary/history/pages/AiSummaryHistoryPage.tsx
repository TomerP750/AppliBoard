import { ArrowLeft, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../shared/ui/Button";
import { DashboardHeader } from "../../../layout/dashboard_header/DashboardHeader";
import { SummaryHistoryCard } from "../components/SummaryHistoryCard";
import { dummyAiSummaryHistory } from "../data/dummyAiSummaryHistory";

export function AiSummaryHistoryPage() {
    const navigate = useNavigate();

    return (
        <section className="min-h-screen bg-zinc-100 p-4 pb-28 dark:bg-dark-background sm:p-6 md:pb-8 lg:p-8">
            <DashboardHeader Icon={History} title="Summary History" />

            <main className="mx-auto mt-8 max-w-5xl sm:mt-10">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
                            Previous analyses
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                            Your monthly summaries
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                            Revisit earlier AI insights and see how your job search has progressed over time.
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        leftIcon={<ArrowLeft className="size-4" />}
                        onClick={() => navigate("/dashboard/ai-summary")}
                        className="w-full sm:w-auto"
                    >
                        Current summary
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {dummyAiSummaryHistory.map((summary) => (
                        <SummaryHistoryCard key={summary.id} summary={summary} />
                    ))}
                </div>
            </main>
        </section>
    );
}

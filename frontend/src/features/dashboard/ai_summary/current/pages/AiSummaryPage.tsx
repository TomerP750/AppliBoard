import { CalendarDays, History, Sparkles, WandSparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../shared/ui/Button";
import { DashboardHeader } from "../../../layout/dashboard_header/DashboardHeader";
import { AnalysisSummary } from "../components/AnalysisSummary";

export function AiSummaryPage() {
    const navigate = useNavigate();

    return (
        <section className="min-h-screen bg-zinc-100 p-4 pb-28 dark:bg-dark-background sm:p-6 md:pb-8 lg:p-8">
            <DashboardHeader Icon={WandSparkles} title="Monthly Analysis" />

            <main className="mx-auto mt-8 max-w-5xl space-y-5 sm:mt-10 sm:space-y-6">
                
                <section className="relative overflow-hidden rounded-3xl border border-black/8 bg-white px-5 py-7 text-zinc-900 shadow-xl shadow-indigo-950/10 dark:border-white/8 dark:bg-zinc-950 dark:text-white sm:px-8 sm:py-9">
                    <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-500/25" />
                    <div className="pointer-events-none absolute -bottom-32 left-1/3 size-64 rounded-full bg-sky-500/15 blur-3xl" />

                    <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-200">
                                <CalendarDays className="size-4" />
                                July 2026
                            </div>
                            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                                Analyze your month
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
                                Get a concise AI summary based on your applications and activity from this month.
                            </p>
                        </div>

                        <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto">
                            <Button
                                variant="headless"
                                loading={false}
                                leftIcon={<Sparkles className="size-4.5 text-indigo-100 dark:text-indigo-600" />}
                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:shadow-black/20 dark:hover:bg-indigo-50"
                            >
                                Analyze this month
                            </Button>
                            <Button
                                variant="headless"
                                leftIcon={<History className="size-4.5 text-indigo-600 dark:text-indigo-200" />}
                                onClick={() => navigate("/dashboard/ai-summary/history")}
                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                View previous summaries
                            </Button>
                        </div>
                    </div>
                </section>

                <AnalysisSummary analysis={null} />
            </main>
        </section>
    );
}

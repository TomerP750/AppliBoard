import { CalendarDays, Sparkles, WandSparkles } from "lucide-react";
import { DashboardHeader } from "../../layout/dashboard_header/DashboardHeader";
import { AnalysisSummary } from "../components/AnalysisSummary";
import { dummyAiSummary } from "../data/dummyAiSummary";


export function AiSummaryPage() {
    return (
        <section className="min-h-screen bg-zinc-100 p-4 pb-28 dark:bg-dark-background sm:p-6 md:pb-8 lg:p-8">
            <DashboardHeader Icon={WandSparkles} title="Monthly Analysis" />

            <main className="mx-auto mt-8 max-w-5xl space-y-5 sm:mt-10 sm:space-y-6">
                <section className="relative overflow-hidden rounded-3xl bg-zinc-950 px-5 py-7 text-white shadow-xl shadow-indigo-950/10 dark:border dark:border-white/8 sm:px-8 sm:py-9">
                    <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-indigo-500/25 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 left-1/3 size-64 rounded-full bg-sky-500/15 blur-3xl" />

                    <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
                                <CalendarDays className="size-4" />
                                July 2026
                            </div>
                            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                                Analyze your month
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-zinc-300 sm:text-base">
                                Get a concise AI summary based on your applications and activity from this month.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/20 transition-colors hover:bg-indigo-50 sm:w-auto"
                        >
                            <Sparkles className="size-4.5 text-indigo-600" />
                            Analyze this month
                        </button>
                    </div>
                </section>

                <AnalysisSummary analysis={dummyAiSummary} />
            </main>
        </section>
    );
}
import type { WeeklyReviewDto } from "../models/WeeklyReviewDto";
import { formatWeekRange } from "../../shared/utils/formatReviewDates";
import { AnalysisNote } from "./AnalysisNote";
import { EmptyAnalysis } from "./EmptyAnalysis";
import { TrendBadge } from "./TrendBadge";

type AnalysisSummaryProps = {
    review: WeeklyReviewDto | null;
};

const DAYS_IN_WEEK = 7;

export function AnalysisSummary({ review }: AnalysisSummaryProps) {
    if (!review) {
        return <EmptyAnalysis />;
    }

    const weeklyStats = [
        { label: "Applications", value: review.totalApplications },
        { label: "Active days", value: `${review.activeDays}/${DAYS_IN_WEEK}` },
        { label: "Best streak", value: `${review.longestStreak} ${review.longestStreak === 1 ? "day" : "days"}` },
    ];

    return (
        <article className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-200/50 dark:border-white/8 dark:bg-zinc-900/70 dark:shadow-none">
            <div className="border-b border-zinc-100 px-5 py-5 dark:border-zinc-800 sm:px-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
                            AI analysis
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                            Your weekly summary
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            {formatWeekRange(review.weekStart, review.weekEnd)}
                        </p>
                    </div>
                    <TrendBadge trend={review.trend} />
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                    {weeklyStats.map(({ label, value }) => (
                        <div
                            key={label}
                            className="rounded-2xl border border-zinc-100 bg-zinc-50 px-3 py-3 dark:border-white/8 dark:bg-white/5 sm:px-4"
                        >
                            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                                {label}
                            </dt>
                            <dd className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-7">
                <p className="text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                    {review.summary}
                </p>

                <ul className="mt-7 grid grid-cols-1 gap-3">
                    {review.notes.map((note, index) => (
                        <AnalysisNote key={`${note.type}-${index}`} note={note} />
                    ))}
                </ul>
            </div>
        </article>
    );
}

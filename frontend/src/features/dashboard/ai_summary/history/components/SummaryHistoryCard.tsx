import { CalendarDays, ChevronRight } from "lucide-react";
import { Button } from "../../../../../shared/ui/Button";
import { TrendBadge } from "../../current/components/TrendBadge";
import type { WeeklyReviewDto } from "../../current/models/WeeklyReviewDto";
import { formatReviewDate, formatWeekRange } from "../../shared/utils/formatReviewDates";
import { getTrendStyle } from "../../shared/utils/getTrendStyle";
import { REVIEW_NOTE_TYPES, reviewNoteStyles } from "../../shared/utils/reviewNoteStyles";

type SummaryHistoryCardProps = {
    review: WeeklyReviewDto;
};

export function SummaryHistoryCard({ review }: SummaryHistoryCardProps) {
    const { accent, hover } = getTrendStyle(review.trend);

    return (
        <article
            className={`group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-200/40 transition-colors duration-200 hover:shadow-md dark:border-white/8 dark:bg-zinc-900/70 dark:shadow-none ${hover}`}
        >
            <span
                className={`absolute inset-y-0 left-0 w-1 transition-all duration-200 group-hover:w-1.5 ${accent}`}
                aria-hidden="true"
            />

            <div className="p-5 pl-6 sm:p-6 sm:pl-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                            <CalendarDays className="size-5" strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                                {formatWeekRange(review.weekStart, review.weekEnd)}
                            </h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {review.totalApplications} applications · {review.activeDays}/7 active days · Generated{" "}
                                {formatReviewDate(review.createdAt)}
                            </p>
                        </div>
                    </div>

                    <TrendBadge trend={review.trend} />
                </div>

                <p className="mt-5 line-clamp-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {review.summary}
                </p>

                <div className="mt-5 flex flex-col gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {REVIEW_NOTE_TYPES.map((noteType) => {
                            const count = review.notes.filter((note) => note.type === noteType).length;
                            if (count === 0) return null;

                            const { pluralLabel, chip, dot } = reviewNoteStyles[noteType];

                            return (
                                <span
                                    key={noteType}
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${chip}`}
                                >
                                    <span className={`size-1.5 rounded-full ${dot}`} aria-hidden="true" />
                                    {count} {pluralLabel}
                                </span>
                            );
                        })}
                    </div>

                    <Button
                        variant="ghost"
                        rightIcon={
                            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        }
                        className="w-full shrink-0 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10 sm:w-auto"
                    >
                        View review
                    </Button>
                </div>
            </div>
        </article>
    );
}

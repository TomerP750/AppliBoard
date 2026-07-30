import { CalendarDays, ChevronRight } from "lucide-react";
import { Button } from "../../../../../shared/ui/Button";
import { TrendBadge } from "../../current/components/TrendBadge";
import { NoteType } from "../../current/models/AiSummaryResponse";
import { getTrendStyle } from "../../shared/utils/getTrendStyle";
import type { AiSummaryHistoryItem } from "../models/AiSummaryHistoryItem";

type SummaryHistoryCardProps = {
    summary: AiSummaryHistoryItem;
};

const noteIndicators = [
    {
        type: NoteType.STRENGTH,
        label: "Strengths",
        style: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
        dot: "bg-emerald-500",
    },
    {
        type: NoteType.OPPORTUNITY,
        label: "Opportunities",
        style: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
        dot: "bg-amber-500",
    },
    {
        type: NoteType.CONCERN,
        label: "Concerns",
        style: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
        dot: "bg-red-500",
    },
];

export function SummaryHistoryCard({ summary }: SummaryHistoryCardProps) {
    const { accent, hover } = getTrendStyle(summary.trend);

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
                            <CalendarDays className="size-5" strokeWidth={1.8} />
                        </span>
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                                {summary.month} {summary.year}
                            </h2>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                Generated {summary.generatedAt}
                            </p>
                        </div>
                    </div>

                    <TrendBadge trend={summary.trend} />
                </div>

                <p className="mt-5 line-clamp-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {summary.summaryParagraph}
                </p>

                <div className="mt-5 flex flex-col gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {noteIndicators.map((indicator) => {
                            const count = summary.notes.filter((note) => note.type === indicator.type).length;

                            if (count === 0) return null;

                            return (
                                <span
                                    key={indicator.type}
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${indicator.style}`}
                                >
                                    <span className={`size-1.5 rounded-full ${indicator.dot}`} />
                                    {count} {indicator.label}
                                </span>
                            );
                        })}
                    </div>

                    <Button
                        variant="ghost"
                        rightIcon={
                            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        }
                        className="w-full shrink-0 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10 sm:w-auto"
                    >
                        View summary
                    </Button>
                </div>
            </div>
        </article>
    );
}

import { CalendarDays, ChevronRight } from "lucide-react";
import { Button } from "../../../../../shared/ui/Button";
import { NoteType } from "../../current/models/AiSummaryResponse";
import type { AiSummaryHistoryItem } from "../models/AiSummaryHistoryItem";

type SummaryHistoryCardProps = {
    summary: AiSummaryHistoryItem;
};

const noteIndicators = [
    { type: NoteType.STRENGTH, label: "Strengths", dot: "bg-emerald-500" },
    { type: NoteType.OPPORTUNITY, label: "Opportunities", dot: "bg-amber-500" },
    { type: NoteType.CONCERN, label: "Concerns", dot: "bg-red-500" },
];

export function SummaryHistoryCard({ summary }: SummaryHistoryCardProps) {
    return (
        <article className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-200/40 transition-shadow hover:shadow-md dark:border-white/8 dark:bg-zinc-900/70 dark:shadow-none sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
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

                    <p className="mt-5 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        {summary.summaryParagraph}
                    </p>
                </div>

                <Button
                    variant="ghost"
                    rightIcon={<ChevronRight className="size-4" />}
                    className="w-full shrink-0 sm:w-auto"
                >
                    View summary
                </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                {noteIndicators.map((indicator) => {
                    const count = summary.notes.filter((note) => note.type === indicator.type).length;

                    if (count === 0) return null;

                    return (
                        <span
                            key={indicator.type}
                            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400"
                        >
                            <span className={`size-2 rounded-full ${indicator.dot}`} />
                            {count} {indicator.label}
                        </span>
                    );
                })}
            </div>
        </article>
    );
}

import type { AiSummaryResponse } from "../models/AiSummaryResponse";
import { AnalysisNote } from "./AnalysisNote";
import { TrendBadge } from "./TrendBadge";

type AnalysisSummaryProps = {
    analysis: AiSummaryResponse;
};

export function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
    return (
        <article className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-200/50 dark:border-white/8 dark:bg-zinc-900/70 dark:shadow-none">
            <div className="border-b border-zinc-100 px-5 py-5 dark:border-zinc-800 sm:px-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
                            AI analysis
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                            Your monthly summary
                        </h2>
                    </div>
                    <TrendBadge trend={analysis.trend} />
                </div>
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-7">
                <p className="text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                    {analysis.summaryParagraph}
                </p>

                <div className="mt-7 grid grid-cols-1 gap-3">
                    {analysis.notes.map((note, index) => (
                        <AnalysisNote key={`${note.type}-${index}`} note={note} />
                    ))}
                </div>
            </div>
        </article>
    );
}

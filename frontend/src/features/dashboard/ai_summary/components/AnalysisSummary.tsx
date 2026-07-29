import { AlertCircle, CheckCircle2, Lightbulb, type LucideIcon } from "lucide-react";
import { NoteType, type AiSummaryResponse } from "../models/AiSummaryResponse";

type AnalysisSummaryProps = {
    analysis: AiSummaryResponse;
};

const noteStyles: Record<
    NoteType,
    { label: string; icon: LucideIcon; container: string; iconStyle: string; labelStyle: string }
> = {
    [NoteType.STRENGTH]: {
        label: "Strength",
        icon: CheckCircle2,
        container: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
        iconStyle: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
        labelStyle: "text-emerald-700 dark:text-emerald-300",
    },
    [NoteType.OPPORTUNITY]: {
        label: "Opportunity",
        icon: Lightbulb,
        container: "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
        iconStyle: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
        labelStyle: "text-amber-700 dark:text-amber-300",
    },
    [NoteType.CONCERN]: {
        label: "Concern",
        icon: AlertCircle,
        container: "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10",
        iconStyle: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
        labelStyle: "text-red-700 dark:text-red-300",
    },
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
                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        Analysis complete
                    </span>
                </div>
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-7">
                <p className="text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                    {analysis.summaryParagraph}
                </p>

                <div className="mt-7 grid grid-cols-1 gap-3">
                    {analysis.notes.map((note, index) => {
                        const style = noteStyles[note.type];
                        const Icon = style.icon;

                        return (
                            <section
                                key={`${note.type}-${index}`}
                                className={`flex items-start gap-4 rounded-2xl border p-4 ${style.container}`}
                            >
                                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${style.iconStyle}`}>
                                    <Icon className="size-4.5" strokeWidth={1.8} />
                                </span>
                                <div>
                                    <h3 className={`text-xs font-semibold uppercase tracking-[0.14em] ${style.labelStyle}`}>
                                        {style.label}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                                        {note.content}
                                    </p>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </article>
    );
}

import { AlertCircle, CheckCircle2, Lightbulb, Sparkles, type LucideIcon } from "lucide-react";

type PendingNote = {
    label: string;
    description: string;
    icon: LucideIcon;
    iconStyle: string;
};


const pendingNotes: PendingNote[] = [
    {
        label: "Strength",
        description: "What is working well in your search.",
        icon: CheckCircle2,
        iconStyle: "bg-emerald-50 text-emerald-600/60 dark:bg-emerald-500/5 dark:text-emerald-300/50",
    },
    {
        label: "Opportunity",
        description: "Where a small change could pay off.",
        icon: Lightbulb,
        iconStyle: "bg-amber-50 text-amber-600/60 dark:bg-amber-500/5 dark:text-amber-300/50",
    },
    {
        label: "Concern",
        description: "What is slipping and needs attention.",
        icon: AlertCircle,
        iconStyle: "bg-red-50 text-red-600/60 dark:bg-red-500/5 dark:text-red-300/50",
    },
];


export function EmptyAnalysis() {
    return (
        <article className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-200/50 dark:border-white/8 dark:bg-zinc-900/70 dark:shadow-none">
                <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
                <div className="pointer-events-none absolute -bottom-32 left-1/3 size-64 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/15" />

                <div className="relative border-b border-zinc-100 px-5 py-5 dark:border-zinc-800 sm:px-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
                                AI analysis
                            </p>
                            <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                                Your monthly summary
                            </h2>
                        </div>

                        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
                            <span className="size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                            Not analyzed
                        </span>
                    </div>
                </div>

                <div className="relative px-5 py-6 sm:px-7 sm:py-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                        This month will cover
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                        {pendingNotes.map(({ label, description, icon: Icon, iconStyle }) => (
                            <section
                                key={label}
                                className="flex items-start gap-4 rounded-2xl border border-dashed border-zinc-200 p-4 dark:border-zinc-700/70"
                            >
                                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${iconStyle}`}>
                                    <Icon className="size-4.5" strokeWidth={1.8} aria-hidden="true" />
                                </span>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                                        {label}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-6 text-zinc-400 dark:text-zinc-500">
                                        {description}
                                    </p>
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                            <Sparkles className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                            Run{" "}
                            <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                                Analyze this month
                            </span>{" "}
                            above to generate your summary.
                        </p>
                    </div>
                </div>
            </article>
    )
}
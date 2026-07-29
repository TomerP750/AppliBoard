import { CheckCircle2, Lightbulb, TrendingUp } from "lucide-react";

const highlights = [
    {
        icon: TrendingUp,
        title: "Strong momentum",
        text: "Your application activity increased and remained consistent throughout the month.",
        style: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    {
        icon: CheckCircle2,
        title: "Quality is improving",
        text: "Applications with personalized notes received more positive responses.",
        style: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300",
    },
    {
        icon: Lightbulb,
        title: "Suggested next step",
        text: "Follow up on pending applications after five business days.",
        style: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    },
];

export function AnalysisSummary() {
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
                    You made steady progress this month, with stronger consistency and a noticeable improvement in
                    response quality. Personalized applications performed best, especially those sent during the
                    middle of the week. Your next opportunity is to follow up with employers more consistently and
                    keep prioritizing roles that closely match your experience.
                </p>

                <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {highlights.map(({ icon: Icon, title, text, style }) => (
                        <section
                            key={title}
                            className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-white/3"
                        >
                            <span className={`grid size-9 place-items-center rounded-xl ${style}`}>
                                <Icon className="size-4.5" strokeWidth={1.8} />
                            </span>
                            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
                            <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{text}</p>
                        </section>
                    ))}
                </div>
            </div>
        </article>
    );
}

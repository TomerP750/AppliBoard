import { AlertCircle, CheckCircle2, Lightbulb, type LucideIcon } from "lucide-react";
import { NoteType, type AiSummaryNote } from "../models/AiSummaryResponse";

type AnalysisNoteProps = {
    note: AiSummaryNote;
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

export function AnalysisNote({ note }: AnalysisNoteProps) {
    const style = noteStyles[note.type];
    const Icon = style.icon;

    return (
        <section className={`flex items-start gap-4 rounded-2xl border p-4 ${style.container}`}>
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${style.iconStyle}`}>
                <Icon className="size-4.5" strokeWidth={1.8} />
            </span>
            <div>
                <h3 className={`text-xs font-semibold uppercase tracking-[0.14em] ${style.labelStyle}`}>
                    {style.label}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{note.content}</p>
            </div>
        </section>
    );
}

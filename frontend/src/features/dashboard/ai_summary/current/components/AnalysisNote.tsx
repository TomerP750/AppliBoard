import type { ReviewNoteDto } from "../models/ReviewNoteDto";
import { reviewNoteStyles } from "../../shared/utils/reviewNoteStyles";

type AnalysisNoteProps = {
    note: ReviewNoteDto;
};

export function AnalysisNote({ note }: AnalysisNoteProps) {
    const style = reviewNoteStyles[note.type];
    const Icon = style.icon;

    return (
        <li className={`flex items-start gap-4 rounded-2xl border p-4 ${style.container}`}>
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${style.iconStyle}`}>
                <Icon className="size-4.5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
                <h3 className={`text-xs font-semibold uppercase tracking-[0.14em] ${style.labelStyle}`}>
                    {style.label}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{note.content}</p>
            </div>
        </li>
    );
}

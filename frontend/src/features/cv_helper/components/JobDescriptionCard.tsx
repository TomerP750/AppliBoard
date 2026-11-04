import { useId, useState } from "react";
import { TextArea } from "../../../shared/ui/TextArea";
import { Button } from "../../../shared/ui/Button";

export function JobDescriptionCard() {
    const titleId = useId();
    const [description, setDescription] = useState("");

    return (
        <section aria-labelledby={`${titleId}-title`} className="min-w-0">
            <h3 id={`${titleId}-title`} className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"><label htmlFor={titleId}>Job description</label></h3>
            <p id={`${titleId}-hint`} className="mb-4 mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Paste the requirements for the role you want.</p>
            <TextArea
                id={titleId}
                aria-describedby={`${titleId}-hint`}
                placeholder="Paste the responsibilities, requirements, and skills for the role here…"
                rows={7}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-64 border-zinc-400 bg-transparent leading-6 dark:border-zinc-500 dark:bg-zinc-950/40"
            />
            <div className="mt-3 flex min-h-8 items-center justify-between gap-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{description.length.toLocaleString()} characters</p>
                <Button variant="ghost" size="sm" className="min-h-11" disabled={!description} onClick={() => setDescription("")}>Clear text</Button>
            </div>
        </section>
    );
}

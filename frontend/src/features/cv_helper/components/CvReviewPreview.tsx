import { Button } from "../../../shared/ui/Button";

export function CvReviewPreview() {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p id="cv-create-unavailable" className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                CV creation is not available yet. You can select a draft and enter a job description to preview the form.
            </p>
            <Button disabled aria-describedby="cv-create-unavailable" className="min-h-11 shrink-0">Create CV</Button>
        </div>
    );
}

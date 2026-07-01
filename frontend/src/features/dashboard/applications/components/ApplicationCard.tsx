import { Heart, StarIcon } from "lucide-react";
import type { JobApplicationDto } from "../models/JobApplicationDto";

type ApplicationCardProps = {
    application: JobApplicationDto;
};

const statusClasses: Record<JobApplicationDto["status"], string> = {
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    IN_PROGRESS: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    ACCEPTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    REJECTED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export function ApplicationCard({ application }: ApplicationCardProps) {
    const formattedAppliedDate = new Date(application.appliedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {application.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{application.city}</p>
                </div>

                <button
                    type="button"
                    aria-label="Toggle favorite"
                    aria-pressed={application.isFavorite}
                    className={`cursor-pointer inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                        application.isFavorite
                            ? "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-700/40 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                >
                    <StarIcon size={12} className={application.isFavorite ? "fill-current" : ""} />
                    Favorite
                </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {application.position}
                </span>

                <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[application.status]}`}
                >
                    {application.status}
                </span>
            </div>

            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Applied on {formattedAppliedDate}</p>
        </article>
    )
}
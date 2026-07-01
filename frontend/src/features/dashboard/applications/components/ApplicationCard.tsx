import { BriefcaseIcon, Building2Icon, CalendarIcon, FileTextIcon, MapPinIcon, StarIcon } from "lucide-react";
import type { JobApplicationDto } from "../models/JobApplicationDto";
import { Button } from "../../../../shared/ui/Button";
import { useState } from "react";
import { RowCard } from "./RowCard";

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

    const [isFavorite, setIsFavorite] = useState(application.isFavorite);

    const formattedAppliedDate = new Date(application.appliedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const rows = [
        { Icon: Building2Icon, text: application.name },
        { Icon: MapPinIcon, text: application.city },
        { Icon: BriefcaseIcon, text: application.position },
        { Icon: CalendarIcon, text: `Applied on ${formattedAppliedDate}` },
    ];

    const handleToggleFavorite = () => {
        setIsFavorite(prev => !prev);
    };

    return (
        <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

            <div className="border-b border-zinc-200 dark:border-zinc-700 pb-3 flex justify-between items-center gap-3">

                <span
                    className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium ${statusClasses[application.status]}`}
                >
                    <FileTextIcon size={18} aria-hidden="true" />

                    {application.status}
                </span>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleFavorite}
                    leftIcon={<StarIcon size={12} className={isFavorite ? "fill-current" : ""} />}
                    aria-label="Toggle favorite"
                    aria-pressed={isFavorite}
                    className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition hover:bg-transparent dark:hover:bg-transparent 
                        ${isFavorite
                            ? "text-yellow-400! hover:text-yellow-300 dark:text-yellow-300 dark:hover:text-yellow-200"
                            : "text-white/60 hover:text-white/80 dark:text-white/60 dark:hover:text-white/80"
                        } focus:outline-none! focus:ring-0!`}
                >
                    {isFavorite ? "Unfavorite" : "Favorite"}
                </Button>


            </div>

            <div className="mt-5 flex flex-col items-start gap-3">

                {rows.map(({ Icon, text }) => (
                    <RowCard key={text} Icon={Icon} text={text} />
                ))}

            </div>


        </article>
    )
}


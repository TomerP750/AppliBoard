import { Building2Icon, CalendarIcon, FileTextIcon, Icon, MapPinIcon, MonitorIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { toTitleCase } from "../../../../shared/util/toTitleCase";
import type { JobApplicationDto } from "../models/JobApplicationDto";
import type { Status } from "../models/Status";
import { DeleteModal } from "./crud_modals/DeleteModal";
import { UpdateModal } from "./crud_modals/UpdateModal";
import { FavoriteButton } from "./FavoriteButton";
import { RowCard } from "./RowCard";
import { getIconByStatus } from "../../analytics/utils/getIconByStatus";

type ApplicationCardProps = {
    application: JobApplicationDto;
};

const statusClasses: Record<Status, string> = {
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    IN_PROGRESS: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    ACCEPTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    REJECTED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};



export function ApplicationCard({ application }: ApplicationCardProps) {

    const accentClasses = {
        PENDING: {
            icon: "bg-indigo-400/10 text-yellow-400 ring-indigo-400/20",
            watermark: "text-yellow-400/30",
            glow: "bg-yellow-400/25",
            button: "!bg-yellow-400 hover:!bg-yellow-500 focus:!ring-yellow-400/40",
        },
        IN_PROGRESS: {
            icon: "bg-sky-400/10 text-sky-400 ring-sky-400/20",
            watermark: "text-sky-400/30",
            glow: "bg-sky-400/25",
            button: "!bg-sky-400 hover:!bg-sky-500 focus:!ring-sky-400/40",
        },
        ACCEPTED: {
            icon: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
            watermark: "text-emerald-400/30",
            glow: "bg-emerald-400/25",
            button: "!bg-emerald-400 hover:!bg-emerald-500 focus:!ring-emerald-400/40",
        },
        REJECTED: {
            icon: "bg-rose-400/10 text-rose-400 ring-rose-400/20",
            watermark: "text-rose-400/30",
            glow: "bg-rose-400/25",
            button: "!bg-rose-400 hover:!bg-rose-500 focus:!ring-rose-400/40",
        },
    }[application.status];

    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);

    const formattedAppliedDate = new Date(application.appliedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const rows = [
        { Icon: Building2Icon, text: application.name },
        { Icon: MapPinIcon, text: application.city },
        { Icon: MonitorIcon, text: toTitleCase(application.position) },
        { Icon: CalendarIcon, text: `Applied on ${formattedAppliedDate}` },
    ];


    const Icon = getIconByStatus(application.status);

    return (
        <article className="relative group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">

            <div className={`absolute -right-5 -bottom-5 h-28 w-28 rounded-full blur-3xl ${accentClasses.glow}`} />
            <Icon
                strokeWidth={1}
                className={`pointer-events-none absolute bottom-1 right-1 w-15 h-15  ${accentClasses.watermark}`}
                aria-hidden="true"
            />

            <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-700">

                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${statusClasses[application.status]}`}
                >
                    <FileTextIcon size={14} aria-hidden="true" />

                    {toTitleCase(application.status)}
                </span>

                <div className="inline-flex items-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/70">

                    <FavoriteButton
                        applicationId={application.id}
                        isFavorite={application.isFavorite}
                    />
                    
                    <span className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" aria-hidden="true" />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUpdateModalOpen(true)}
                        leftIcon={<PencilIcon size={18} />}
                        aria-label={`Edit ${application.name}`}
                        className="h-10 w-10 rounded-none p-0 text-zinc-500 hover:bg-white hover:text-zinc-800 focus:ring-brand-primary/30 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                    />

                    <span className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" aria-hidden="true" />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteModalOpen(true)}
                        leftIcon={<Trash2Icon size={18} />}
                        aria-label={`Delete ${application.name}`}
                        className="h-10 w-10 rounded-none p-0 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 focus:ring-rose-500/30 dark:text-zinc-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
                    />
                </div>

                <DeleteModal
                    applicationId={application.id}
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                />

                <UpdateModal
                    application={application}
                    isOpen={updateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                />

            </div>

            <ul className="mt-5 flex flex-col items-start gap-3">

                {rows.map(({ Icon, text }) => (
                    <li key={text}>
                        <RowCard Icon={Icon} text={text} />
                    </li>
                ))}

            </ul>


        </article>
    )
}


import { BriefcaseIcon, CalendarIcon, ClockAlertIcon, MapPinIcon, NotepadText, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { toTitleCase } from "../../../../shared/util/toTitleCase";
import type { JobApplicationDto } from "../models/JobApplicationDto";
import type { Status } from "../models/Status";
import { DeleteModal } from "./crud_modals/DeleteModal";
import { UpdateModal } from "./crud_modals/UpdateModal";
import { FavoriteButton } from "./FavoriteButton";
import { NoteModal } from "./NoteModal";

type ApplicationCardProps = {
    application: JobApplicationDto;
};

const statusStyles: Record<Status, { pill: string; dot: string }> = {
    PENDING: {
        pill: "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
        dot: "bg-amber-500 dark:bg-amber-400",
    },
    IN_PROGRESS: {
        pill: "bg-sky-50 text-sky-800 ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20",
        dot: "bg-sky-500 dark:bg-sky-400",
    },
    ACCEPTED: {
        pill: "bg-emerald-50 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
        dot: "bg-emerald-500 dark:bg-emerald-400",
    },
    REJECTED: {
        pill: "bg-rose-50 text-rose-800 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20",
        dot: "bg-rose-500 dark:bg-rose-400",
    },
};

const iconActionClassName =
    "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40";

const neutralIconActionClassName =
    `${iconActionClassName} text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100`;

const fieldLabelClassName = "flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400";

const fieldValueClassName = "mt-1 truncate text-[15px] font-medium text-zinc-800 dark:text-zinc-100";

export function ApplicationCard({ application }: ApplicationCardProps) {

    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
    const [noteModalOpen, setNoteModalOpen] = useState<boolean>(false);

    const formattedAppliedDate = new Date(application.appliedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const companyInitial = application.name.trim().charAt(0).toUpperCase() || "?";
    const { pill, dot } = statusStyles[application.status];

    return (
        <article className="flex flex-col rounded-xl border border-zinc-200 bg-white shadow-xs transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-dark-surface dark:hover:border-white/20">

            <header className="flex items-start gap-4 p-6 pb-5">
                <div
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-lg font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200 dark:bg-white/5 dark:text-zinc-200 dark:ring-white/10"
                >
                    {companyInitial}
                </div>

                <div className="min-w-0 flex-1">
                    <h3
                        title={application.name}
                        className="truncate text-lg font-semibold leading-7 tracking-tight text-zinc-950 dark:text-white"
                    >
                        {application.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                        <BriefcaseIcon size={15} aria-hidden="true" className="shrink-0" />
                        <span className="min-w-0 truncate">{toTitleCase(application.position)}</span>
                    </p>
                </div>

                <div className="-mr-2 -mt-1 flex shrink-0 items-center">
                    <FavoriteButton
                        applicationId={application.id}
                        isFavorite={application.isFavorite}
                        className={iconActionClassName}
                    />
                    <Button
                        variant="headless"
                        onClick={() => setUpdateModalOpen(true)}
                        leftIcon={<PencilIcon size={18} aria-hidden="true" />}
                        aria-label={`Edit ${application.name}`}
                        title="Edit"
                        className={neutralIconActionClassName}
                    />
                    <Button
                        variant="headless"
                        onClick={() => setDeleteModalOpen(true)}
                        leftIcon={<Trash2Icon size={18} aria-hidden="true" />}
                        aria-label={`Delete ${application.name}`}
                        title="Delete"
                        className={`${iconActionClassName} text-zinc-500 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-rose-400/10 dark:hover:text-rose-300`}
                    />
                </div>
            </header>

            <dl className="grid grid-cols-2 gap-6 border-t border-zinc-100 px-6 py-5 dark:border-white/5">
                <div className="min-w-0">
                    <dt className={fieldLabelClassName}>
                        <MapPinIcon size={14} aria-hidden="true" className="shrink-0" />
                        Location
                    </dt>
                    <dd title={application.city} className={fieldValueClassName}>
                        {application.city || "—"}
                    </dd>
                </div>
                <div className="min-w-0">
                    <dt className={fieldLabelClassName}>
                        <CalendarIcon size={14} aria-hidden="true" className="shrink-0" />
                        Applied
                    </dt>
                    <dd className={fieldValueClassName}>
                        <time dateTime={application.appliedAt}>{formattedAppliedDate}</time>
                    </dd>
                </div>
            </dl>

            <footer className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-100 px-6 py-4 dark:border-white/5">
                <div className="flex min-w-0 items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${pill}`}>
                        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                        {toTitleCase(application.status)}
                    </span>

                    {application.isStale && (
                        <span
                            title="No updates on this application for a while"
                            className="inline-flex items-center gap-1 truncate text-xs font-medium text-amber-700 dark:text-amber-300"
                        >
                            <ClockAlertIcon size={14} aria-hidden="true" className="shrink-0" />
                            Needs follow-up
                        </span>
                    )}
                </div>

                {application.note ? (
                    <button
                        type="button"
                        onClick={() => setNoteModalOpen(true)}
                        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
                    >
                        <NotepadText size={16} aria-hidden="true" />
                        View note
                    </button>
                ) : (
                    <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">No note</span>
                )}
            </footer>

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

            <NoteModal
                title={`${application.name} Note`}
                note={application.note}
                isOpen={noteModalOpen}
                onClose={() => setNoteModalOpen(false)}
            />

        </article>
    )
}

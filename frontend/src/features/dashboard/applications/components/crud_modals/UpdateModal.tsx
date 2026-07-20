import { BriefcaseIcon, Building2Icon, FileTextIcon, MapPinIcon, PencilIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../../../../shared/ui/Button";
import { Input } from "../../../../../shared/ui/Input";
import { Modal } from "../../../../../shared/ui/Modal";
import { toTitleCase } from "../../../../../shared/util/toTitleCase";
import jobApplicationService from "../../api/jobApplicationService";
import type { JobApplicationDto } from "../../models/JobApplicationDto";
import { Position } from "../../models/Position";
import { Status } from "../../models/Status";
import type { UpdateJobApplicationDto } from "../../models/UpdateJobApplicationDto";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../../../shared/models/ApiErrorResponse";
import { TextArea } from "../../../../../shared/ui/TextArea";

interface UpdateModalProps {
    application: JobApplicationDto;
    isOpen: boolean;
    onClose: () => void;
}

const selectClasses =
    "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 dark:border-zinc-800 dark:bg-stone-800 dark:text-zinc-100";

const selectErrorClasses =
    "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500";

const fieldLabelClasses =
    "inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300";

const fieldIconClasses = "text-zinc-400 dark:text-zinc-500";

export function UpdateModal({ application, isOpen, onClose }: UpdateModalProps) {

    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateJobApplicationDto>({
        defaultValues: {
            name: application.name,
            city: application.city,
            status: application.status,
            position: application.position,
            note: application.note,
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                name: application.name,
                city: application.city,
                status: application.status,
                position: application.position,
                note: application.note,
            });
        }
    }, [application, isOpen, reset]);

    const { mutate: updateJobApplication, isPending } = useMutation<void, AxiosError<ApiErrorResponse>, UpdateJobApplicationDto>({
        mutationFn: (dto: UpdateJobApplicationDto) => jobApplicationService.updateJobApplication(application.id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            onClose();
            toast.success("Application updated successfully.");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message ?? "Failed to update application. Please try again.");
        },
    });

    const handleUpdate = (dto: UpdateJobApplicationDto) => {
        updateJobApplication(dto);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            className="overflow-hidden p-0"
        >
            <form onSubmit={handleSubmit(handleUpdate)} className="flex flex-col">
                <div className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-sm shadow-brand-primary/25">
                                <PencilIcon size={19} aria-hidden="true" />
                            </div>

                            <div className="min-w-0">
                                <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                                    Edit Application
                                </h2>
                                <p className="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400">
                                    Update the key details for this application.
                                </p>
                            </div>
                        </div>

                        <div className="hidden max-w-56 rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-right text-xs text-zinc-500 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400 sm:block">
                            <p className="font-medium uppercase tracking-wide">Editing</p>
                            <p className="mt-0.5 truncate text-sm font-semibold normal-case tracking-normal text-zinc-950 dark:text-zinc-50">
                                {application.name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 px-5 py-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="update-application-name" className={fieldLabelClasses}>
                                <Building2Icon size={16} className={fieldIconClasses} />
                                Company Name
                            </label>
                            <Input
                                id="update-application-name"
                                placeholder="Acme Inc."
                                error={errors.name?.message}
                                disabled={isPending}
                                {...register("name", { required: "Name is required" })}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="update-application-city" className={fieldLabelClasses}>
                                <MapPinIcon size={16} className={fieldIconClasses} />
                                City
                            </label>
                            <Input
                                id="update-application-city"
                                placeholder="Tel Aviv"
                                error={errors.city?.message}
                                disabled={isPending}
                                {...register("city", { required: "City is required" })}
                            />
                        </div>
                    </div>


                    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                        
                        {/* Status */}
                        <div className="flex flex-col gap-1.5 p-3 rounded-xl">
                            <label htmlFor="update-application-status" className={fieldLabelClasses}>
                                <FileTextIcon size={16} className={fieldIconClasses} />
                                Status
                            </label>
                            <select
                                id="update-application-status"
                                disabled={isPending}
                                aria-invalid={errors.status ? true : undefined}
                                {...register("status", { required: "Status is required" })}
                                className={`${selectClasses} ${errors.status ? selectErrorClasses : ""}`}
                            >
                                {Object.values(Status).map((status) => (
                                    <option key={status} value={status}>
                                        {toTitleCase(status)}
                                    </option>
                                ))}
                            </select>
                            {errors.status ? (
                                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                                    {errors.status.message}
                                </p>
                            ) : null}
                        </div>

                        {/* Position */}
                        <div className="flex flex-col gap-1.5 p-3">
                            <label htmlFor="update-application-position" className={fieldLabelClasses}>
                                <BriefcaseIcon size={16} className={fieldIconClasses} />
                                Position
                            </label>
                            <select
                                id="update-application-position"
                                disabled={isPending}
                                aria-invalid={errors.position ? true : undefined}
                                {...register("position", { required: "Position is required" })}
                                className={`${selectClasses} ${errors.position ? selectErrorClasses : ""}`}
                            >
                                {Object.values(Position).map((position) => (
                                    <option key={position} value={position}>
                                        {toTitleCase(position)}
                                    </option>
                                ))}
                            </select>
                            {errors.position ? (
                                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                                    {errors.position.message}
                                </p>
                            ) : null}
                        </div>
                    </div>


                    <div className="flex flex-col gap-1.5">
                        <TextArea
                            label="Note"
                            rows={3}
                            placeholder="Add a quick reminder, contact name, or next step..."
                            error={errors.note?.message}
                            disabled={isPending}
                            className="min-h-24"
                            {...register("note", { maxLength: { value: 500, message: "Note must be less than 500 characters" } })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-5 py-3.5">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" loading={isPending} >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );

}
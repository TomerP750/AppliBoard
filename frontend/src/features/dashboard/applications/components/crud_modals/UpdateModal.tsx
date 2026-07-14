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

interface UpdateModalProps {
    application: JobApplicationDto;
    isOpen: boolean;
    onClose: () => void;
}

const selectClasses =
    "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100";

const selectErrorClasses =
    "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500";

export function UpdateModal({ application, isOpen, onClose }: UpdateModalProps) {

    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateJobApplicationDto>({
        defaultValues: {
            name: application.name,
            city: application.city,
            status: application.status,
            position: application.position,
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                name: application.name,
                city: application.city,
                status: application.status,
                position: application.position,
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
            size="md"
            className="overflow-hidden p-0"
        >
            <form onSubmit={handleSubmit(handleUpdate)} className="flex flex-col">
                <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-950/60">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20">
                            <PencilIcon size={21} aria-hidden="true" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                                Edit Application
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Update the job details you are tracking.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                        Editing <span className="font-semibold text-zinc-950 dark:text-zinc-50">{application.name}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="update-application-name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <span className="inline-flex items-center gap-2">
                                <Building2Icon size={16} className="text-zinc-400 dark:text-zinc-500" />
                                Company Name
                            </span>
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
                        <label htmlFor="update-application-city" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <span className="inline-flex items-center gap-2">
                                <MapPinIcon size={16} className="text-zinc-400 dark:text-zinc-500" />
                                City
                            </span>
                        </label>
                        <Input
                            id="update-application-city"
                            placeholder="Tel Aviv"
                            error={errors.city?.message}
                            disabled={isPending}
                            {...register("city", { required: "City is required" })}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="update-application-status" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <span className="inline-flex items-center gap-2">
                                <FileTextIcon size={16} className="text-zinc-400 dark:text-zinc-500" />
                                Status
                            </span>
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

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="update-application-position" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <span className="inline-flex items-center gap-2">
                                <BriefcaseIcon size={16} className="text-zinc-400 dark:text-zinc-500" />
                                Position
                            </span>
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

                <div className="grid grid-cols-2 gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isPending}
                        className="w-full"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" loading={isPending} className="w-full">
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );

}
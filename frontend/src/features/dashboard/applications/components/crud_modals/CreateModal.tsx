import { BriefcaseIcon, Building2Icon, FileTextIcon, MapPinIcon } from "lucide-react";
import { Button } from "../../../../../shared/ui/Button";
import { Input } from "../../../../../shared/ui/Input";
import { Modal } from "../../../../../shared/ui/Modal";
import { toTitleCase } from "../../../../../shared/util/toTitleCase";
import { useForm } from "react-hook-form";
import type { CreateJobApplicationDto } from "../../models/CreateJobApplicationDto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import jobApplicationService from "../../api/jobApplicationService";
import { Position } from "../../models/Position";
import { Status } from "../../models/Status";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../../../shared/models/ApiErrorResponse";


interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateModal({ isOpen, onClose }: CreateModalProps) {

    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors },} = useForm<CreateJobApplicationDto>();

    const { mutate: createJobApplication, isPending } = useMutation<void, AxiosError<ApiErrorResponse>, CreateJobApplicationDto>({
        mutationFn: (dto: CreateJobApplicationDto) => jobApplicationService.createJobApplication(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["applications"],
            });
    
            onClose();
            toast.success("Application created successfully.");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message ?? "Failed to create application. Please try again.");
        },
    });
    
    const handleCreateJobApplication = (dto: CreateJobApplicationDto) => {
        createJobApplication(dto);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <form onSubmit={handleSubmit(handleCreateJobApplication)} className="mx-auto flex w-full max-w-sm flex-col gap-5">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        Create Application
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Add the job details you want to track.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <span className="inline-flex items-center gap-2">
                            <Building2Icon size={16} className="text-zinc-400 dark:text-zinc-500" />
                            Company Name
                        </span>
                        <Input 
                        placeholder="Acme Inc." 
                        {...register("name", { required: "Name is required" })} 
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <span className="inline-flex items-center gap-2">
                            <MapPinIcon size={16} className="text-zinc-400 dark:text-zinc-500" />
                            City
                        </span>
                        <Input 
                        placeholder="Tel Aviv" 
                        {...register("city", { required: "City is required" })} />
                        {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <span className="inline-flex items-center gap-2">
                            <FileTextIcon size={16} className="text-zinc-400 dark:text-zinc-500" />
                            Status
                        </span>
                        <select
                            defaultValue=""
                            {...register("status", { required: "Status is required" })}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                        >
                            <option value="" disabled>
                                Select status
                            </option>
                            {Object.values(Status).map((status) => (
                                <option key={status} value={status}>
                                    {toTitleCase(status)}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <span className="inline-flex items-center gap-2">
                            <BriefcaseIcon size={16} className="text-zinc-400 dark:text-zinc-500" />
                            Position
                        </span>
                        <select
                            defaultValue=""
                            {...register("position", { required: "Position is required" })}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                        >
                            <option value="" disabled>
                                Select position
                            </option>
                            {Object.values(Position).map((position) => (
                                <option key={position} value={position}>
                                    {toTitleCase(position)}
                                </option>
                            ))}
                        </select>
                        {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
                    </label>
                </div>

                <div className="flex justify-center gap-3 pt-10">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={isPending}>
                        Create
                    </Button>
                </div>
                
            </form>
        </Modal>
    );
}
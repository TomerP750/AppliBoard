import { Button } from "../../../../shared/ui/Button";
import { Modal } from "../../../../shared/ui/Modal";
import { useForm } from "react-hook-form";
import type { UpdateJobApplicationDto } from "../models/UpdateJobApplicationDto";
import { useMutation } from "@tanstack/react-query";
import jobApplicationService from "../api/jobApplicationService";
import type { JobApplicationDto } from "../models/JobApplicationDto";

interface UpdatedModalProps {
    applicationId: string;
    isOpen: boolean;
    onClose: () => void;
    // onUpdate: (data: UpdateJobApplicationDto) => void;
}

export function UpdatedModal({ applicationId, isOpen, onClose }: UpdatedModalProps) {

    const { register, handleSubmit, formState: { errors } } = useForm<UpdateJobApplicationDto>();

    const { mutate: updateJobApplication, isPending } = useMutation({
        mutationFn: (dto: UpdateJobApplicationDto) => jobApplicationService.updateJobApplication(applicationId, dto),
        onSuccess: (data: JobApplicationDto) => {
            // onUpdate(data);
            onClose();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleUpdate = (dto: UpdateJobApplicationDto) => {
        updateJobApplication(dto);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(handleUpdate)}>
                <div className="relative px-6 pb-6 pt-7">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-orange-400" />
                    <h2>Application Updated</h2>
                    <p>The application has been updated successfully.</p>
                    <Button onClick={onClose}>Close</Button>
                    <Button type="submit">Update</Button>
                </div>
            </form>
        </Modal>
    );

}
import { StarIcon } from "lucide-react";
import { Button } from "../../../../shared/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import jobApplicationService from "../api/jobApplicationService";
import type { JobApplicationDto } from "../models/JobApplicationDto";
import type { PageResponse } from "../../../../shared/models/PageResponse";

interface FavoriteButtonProps {
    applicationId: string;
    isFavorite: boolean;
    /** Layout and focus classes shared with the card's other icon actions. */
    className?: string;
}

export function FavoriteButton({ applicationId, isFavorite, className = "" }: FavoriteButtonProps) {

    const queryClient = useQueryClient();

    const { mutate: toggleFavorite } = useMutation<boolean>({
        mutationFn: () => jobApplicationService.toggleJobApplicationFavorite(applicationId),
        onSuccess: (isFavoriteFromServer) => {
            queryClient.setQueriesData<PageResponse<JobApplicationDto>>(
                { queryKey: ["applications"] },
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        content: oldData.content.map((application: JobApplicationDto) =>
                            application.id === applicationId
                                ? { ...application, isFavorite: isFavoriteFromServer }
                                : application
                        ),
                    };
                }
            );
        },

        onError: (error) => {
            console.error(error);
        },
    });

    const handleToggleFavorite = () => {
        toggleFavorite();
    };

    const stateClassName = isFavorite
        ? "text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-400/10"
        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100";

    return (
        <Button
            variant="headless"
            onClick={handleToggleFavorite}
            leftIcon={<StarIcon size={18} aria-hidden="true" className={isFavorite ? "fill-current" : ""} />}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`${className} ${stateClassName}`}
        />
    );
}
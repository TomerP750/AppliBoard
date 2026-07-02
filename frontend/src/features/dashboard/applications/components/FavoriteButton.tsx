import { StarIcon } from "lucide-react";
import { Button } from "../../../../shared/ui/Button";
import { useMutation } from "@tanstack/react-query";
import jobApplicationService from "../api/jobApplicationService";

interface FavoriteButtonProps {
    applicationId: string;
    isFavorite: boolean;
}

export function FavoriteButton({ applicationId, isFavorite }: FavoriteButtonProps) {
    
    const { mutate: toggleFavorite, isPending } = useMutation<boolean>({
        mutationFn: () => jobApplicationService.toggleJobApplicationFavorite(applicationId),
        onSuccess: (data: boolean) => {
            console.log("Card is favorite: " ,data);
        },
        onError: (error) => {
            console.error(error);
        },
    });
    
    const handleToggleFavorite = () => {
        toggleFavorite();
    };
    
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            leftIcon={<StarIcon size={18} className={isFavorite ? "fill-current" : ""} />}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            className={`h-10 w-10 rounded-none p-0 transition outline-none! focus:ring-0!
                            ${isFavorite
                    ? "text-yellow-500! hover:bg-yellow-50 hover:text-yellow-500 dark:text-yellow-300 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-200"
                    : "text-zinc-500 hover:bg-white hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                }`}
        />
    );
}
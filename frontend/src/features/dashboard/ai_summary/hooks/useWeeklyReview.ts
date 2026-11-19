import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { ApiErrorResponse } from "../../../../shared/models/ApiErrorResponse";
import weeklyReviewService, { type WeeklyReviewHistoryParams } from "../api/weeklyReviewService";
import type { WeeklyReviewDto } from "../current/models/WeeklyReviewDto";

/** The backend sends error messages as a plain string body; other endpoints may send { message }. */
type WeeklyReviewError = AxiosError<ApiErrorResponse | string>;

const HTTP_CONFLICT = 409;

export const weeklyReviewQueryKeys = {
    all: ["weekly-review"] as const,
    current: () => [...weeklyReviewQueryKeys.all, "current"] as const,
    history: (params: WeeklyReviewHistoryParams) => [...weeklyReviewQueryKeys.all, "history", params] as const,
};

export function useCurrentWeeklyReview() {
    return useQuery({
        queryKey: weeklyReviewQueryKeys.current(),
        queryFn: () => weeklyReviewService.currentReview(),
    });
}

export function useWeeklyReviewHistory(params: WeeklyReviewHistoryParams) {
    return useQuery({
        queryKey: weeklyReviewQueryKeys.history(params),
        queryFn: () => weeklyReviewService.reviewHistory(params),
        placeholderData: keepPreviousData,
    });
}

export function useGenerateWeeklyReview() {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation<WeeklyReviewDto, WeeklyReviewError, void>({
        mutationFn: () => weeklyReviewService.generateReview(),
        onSuccess: () => {
            toast.success("Your weekly review is ready.");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
        onSettled: (_review, error) => {
            // A 409 also means our "can generate" state was stale, so refresh it either way.
            if (!error || error.response?.status === HTTP_CONFLICT) {
                queryClient.invalidateQueries({ queryKey: weeklyReviewQueryKeys.all });
            }
        },
    });

    return { generateReview: mutate, isGenerating: isPending };
}

function getErrorMessage(error: WeeklyReviewError): string {
    const responseBody = error.response?.data;
    if (typeof responseBody === "string" && responseBody.length > 0) {
        return responseBody;
    }
    if (typeof responseBody === "object" && responseBody?.message) {
        return responseBody.message;
    }
    return "Couldn't generate your weekly review. Please try again.";
}

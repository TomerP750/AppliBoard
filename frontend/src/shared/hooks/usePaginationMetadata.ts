import type { PageResponse } from "../models/PageResponse";

export function usePaginationMetadata<T>(
    pageResponse: PageResponse<T> | undefined,
    fallbackPage: number,
) {
    const paginationMetadata = pageResponse?.page;
    const currentPage = paginationMetadata?.number ?? fallbackPage;
    const totalPages = paginationMetadata?.totalPages ?? 0;

    return {
        currentPage,
        totalPages,
        canGoToPreviousPage: currentPage > 0,
        canGoToNextPage: totalPages > 0 && currentPage + 1 < totalPages,
    };
}

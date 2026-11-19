import { ArrowLeft, CalendarDays, History } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaginationMetadata } from "../../../../../shared/hooks/usePaginationMetadata";
import { Button } from "../../../../../shared/ui/Button";
import { Pagination } from "../../../../../shared/ui/Pagination";
import { DashboardHeader } from "../../../layout/dashboard_header/DashboardHeader";
import { useWeeklyReviewHistory } from "../../hooks/useWeeklyReview";
import { ReviewLoadError, ReviewLoading } from "../../shared/components/ReviewQueryStates";
import { SummaryHistoryCard } from "../components/SummaryHistoryCard";

const DEFAULT_PAGE_SIZE = 10;

export function AiSummaryHistoryPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const { data: reviewPage, isLoading, isError, refetch } = useWeeklyReviewHistory({ page, size: pageSize });
    const { currentPage, totalPages, canGoToPreviousPage, canGoToNextPage } = usePaginationMetadata(reviewPage, page);
    const reviews = reviewPage?.content ?? [];
    const goToCurrentReview = () => navigate("/dashboard/ai-summary");

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(0);
    };

    return (
        <section className="min-h-screen bg-zinc-100 p-4 pb-28 dark:bg-dark-background sm:p-6 md:pb-8 lg:p-8">
            <DashboardHeader Icon={History} title="Review History" />

            <main className="mx-auto mt-8 max-w-5xl sm:mt-10">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
                            Previous reviews
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                            Your weekly reviews
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                            See how your application consistency has changed from week to week.
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        leftIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
                        onClick={goToCurrentReview}
                        className="w-full sm:w-auto"
                    >
                        This week's review
                    </Button>
                </div>

                {isLoading && <ReviewLoading label="Loading your reviews..." />}

                {isError && !reviewPage && <ReviewLoadError message="Couldn't load your reviews." onRetry={() => refetch()} />}

                {reviewPage && reviews.length === 0 && (
                    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-zinc-300 bg-white px-5 py-14 text-center dark:border-zinc-700 dark:bg-zinc-900/70">
                        <CalendarDays className="size-6 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">No reviews yet</p>
                        <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                            Generate your first weekly review to start tracking your consistency.
                        </p>
                        <Button variant="primary" onClick={goToCurrentReview}>
                            Go to this week's review
                        </Button>
                    </div>
                )}

                {reviews.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                        {reviews.map((review) => (
                            <SummaryHistoryCard key={review.id} review={review} />
                        ))}

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                currentPageSize={pageSize}
                                totalPages={totalPages}
                                canPrevious={canGoToPreviousPage}
                                canNext={canGoToNextPage}
                                onPrevious={() => setPage(currentPage - 1)}
                                onNext={() => setPage(currentPage + 1)}
                                onPageChange={setPage}
                                onPageSizeChange={handlePageSizeChange}
                                pageSizeOptions={[10, 20, 50]}
                            />
                        )}
                    </div>
                )}
            </main>
        </section>
    );
}

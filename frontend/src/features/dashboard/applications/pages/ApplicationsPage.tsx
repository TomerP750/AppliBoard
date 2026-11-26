import { useQuery } from "@tanstack/react-query";
import { Briefcase, ListFilter, Plus } from "lucide-react";
import { useState } from "react";
import { usePaginationMetadata } from "../../../../shared/hooks/usePaginationMetadata";
import { Button } from "../../../../shared/ui/Button";
import { Pagination } from "../../../../shared/ui/Pagination";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import { DashboardHeader } from "../../layout/dashboard_header/DashboardHeader";
import jobApplicationService from "../api/jobApplicationService";
import { ApplicationCard } from "../components/ApplicationCard";
import { CreateModal } from "../components/crud_modals/CreateModal";
import { EmptyApplications } from "../components/EmptyApplications";
import { FilterMenu } from "../components/FilterMenu";
import { useApplicationsFilters } from "../hooks/useApplicationsFilters";
import { LoadingPage } from "../../../../shared/ui/LoadingPage";


export default function ApplicationsPage() {

    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const { allJobApplicationsParams,
        requestedName,
        showFavoritesOnly,
        requestedStatuses,
        requestedPositions,
        APPLICATIONS_PAGE_SIZE_OPTIONS,
        requestedPage,
        requestedPageSize,
        handleSearch,
        updatePaginationParams,
        updatePageSizeParam,
        updateFavoritesFilter,
        resetFilters,
        updateStatusFilter,
        updatePositionFilter } = useApplicationsFilters();

    const { data: applications, isLoading, isError } = useQuery({
        queryKey: ["applications", allJobApplicationsParams],
        queryFn: () => jobApplicationService.allJobApplications(allJobApplicationsParams),
        staleTime: 1000 * 60 * 5
    });

    const applicationsList = applications?.content ?? [];
    const empty = applicationsList.length === 0;

    const { currentPage, totalPages, canGoToPreviousPage, canGoToNextPage } = usePaginationMetadata(applications, requestedPage);

    return (
        <section className="flex h-dvh flex-col bg-zinc-50 p-6 pb-28 md:pb-6 dark:bg-dark-background">

            <DashboardHeader Icon={Briefcase} title={"Your Applications"} />

            <div className="mt-6 flex min-h-0 w-full max-w-7xl flex-1 flex-col">
                <div className="flex shrink-0 flex-wrap items-center gap-2">

                    <Button
                        className="rounded-none!"
                        onClick={() => {
                            setIsFilterMenuOpen(false);
                            setAddModalOpen(true);
                        }}
                        leftIcon={<Plus
                            size={16} />}>
                        Add Application
                    </Button>

                    <div className="w-full max-w-2xl flex-1 min-w-[280px]">
                        <SearchInput
                            key={requestedName}
                            className="rounded-none!"
                            placeholder="Search applications By Name..."
                            defaultValue={requestedName}
                            onAfterSearch={handleSearch}
                        />
                    </div>

                    <div className="relative">
                        <Button
                            className="rounded-none!"
                            variant="secondary"
                            leftIcon={<ListFilter size={16} />}
                            onClick={() => setIsFilterMenuOpen((prev) => !prev)}
                        >
                            Filter
                        </Button>

                        {isFilterMenuOpen && (
                            <div className="absolute right-0 top-full z-20 mt-2">
                                <FilterMenu
                                    onClose={() => setIsFilterMenuOpen(false)}
                                    selectedStatuses={requestedStatuses}
                                    selectedPositions={requestedPositions}
                                    onAddStatusFilter={updateStatusFilter}
                                    onAddPositionFilter={updatePositionFilter}
                                    showFavoritesOnly={showFavoritesOnly}
                                    onShowFavoritesOnlyChange={updateFavoritesFilter}
                                    onResetFilters={resetFilters}
                                    onApplyFilters={() => setIsFilterMenuOpen(false)}
                                />
                            </div>
                        )}
                    </div>

                    {applications && !empty && (
                        <p className="ml-auto text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                                {applications.page.totalElements}
                            </span>
                            {applications.page.totalElements === 1 ? " application" : " applications"}
                        </p>
                    )}
                </div>

                <CreateModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                />

                <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10">
                    {isLoading ? (
                        <LoadingPage fullScreen={false} className="flex-1" message="Loading applications..." />
                    ) : isError ? (
                        <p className="p-6 text-sm text-rose-600 dark:text-rose-400">Could not load applications.</p>
                    ) : empty ? (
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <EmptyApplications />
                        </div>
                    ) : (
                        <>
                            {/* Keyed by page so the list scrolls back to the top when the page changes. */}
                            <div key={currentPage} className="min-h-0 flex-1 overflow-y-auto p-4">
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                                    {applicationsList.map((application) => (
                                        <ApplicationCard
                                            key={application.id}
                                            application={application} />
                                    ))}
                                </div>
                            </div>

                            <Pagination
                                className="shrink-0 px-4 pb-4"
                                currentPage={currentPage}
                                currentPageSize={requestedPageSize}
                                totalPages={totalPages}
                                canPrevious={canGoToPreviousPage}
                                canNext={canGoToNextPage}
                                onPrevious={() => updatePaginationParams(currentPage - 1)}
                                onNext={() => updatePaginationParams(currentPage + 1)}
                                onPageChange={updatePaginationParams}
                                onPageSizeChange={updatePageSizeParam}
                                pageSizeOptions={APPLICATIONS_PAGE_SIZE_OPTIONS}
                            />
                        </>
                    )}
                </div>
            </div>

        </section>
    )
}
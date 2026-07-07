import { useQuery } from "@tanstack/react-query";
import { Briefcase, ListFilter, Plus } from "lucide-react";
import { useState } from "react";
import { usePaginationMetadata } from "../../../../shared/hooks/usePaginationMetadata";
import { Button } from "../../../../shared/ui/Button";
import { Pagination } from "../../../../shared/ui/Pagination";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import { DashboardHeader } from "../../layout/DashboardHeader";
import jobApplicationService from "../api/jobApplicationService";
import { ApplicationCard } from "../components/ApplicationCard";
import { CreateModal } from "../components/crud_modals/CreateModal";
import { EmptyApplications } from "../components/EmptyApplications";
import { FilterMenu } from "../components/FilterMenu";
import { useApplicationsFilters } from "../hooks/useApplicationsFilters";


export default function ApplicationsPage() {

    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const { searchApplicationsParams,
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
        queryKey: ["applications", searchApplicationsParams],
        queryFn: () => jobApplicationService.searchJobApplications(searchApplicationsParams),
        staleTime: 1000 * 60 * 5
    });

    const applicationsList = applications?.content ?? [];
    const empty = applicationsList.length === 0;

    const { currentPage, totalPages, canGoToPreviousPage, canGoToNextPage } = usePaginationMetadata(applications, requestedPage);

    return (
        <section className="min-h-screen bg-zinc-50 p-4 sm:p-6 dark:bg-dark-background">

            <DashboardHeader Icon={Briefcase} title={"Your Applications"} />

            <div className="mt-8 max-w-7xl">
                <div className="flex flex-wrap items-center gap-2">

                    <Button
                        className="rounded-none!"
                        onClick={() => setAddModalOpen(true)}
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
                </div>

                <CreateModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                />

                {isLoading ? (
                    <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">{requestedName ? "Searching applications..." : "Loading applications..."}</p>
                ) : isError ? (
                    <p className="mt-6 text-sm text-rose-600 dark:text-rose-400">Could not load applications.</p>
                ) : empty ? (
                    <EmptyApplications />
                ) : (
                    <>
                        <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
                            Total applications{" "}
                            <span className="ml-1 font-semibold text-zinc-900 dark:text-white">
                                {applications?.page.totalElements}
                            </span>
                        </p>
                        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 ">
                            {applicationsList.map((application) => (
                                <ApplicationCard
                                    key={application.id}
                                    application={application} />
                            ))}
                        </div>

                        <Pagination
                            className="mt-6"
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

        </section>
    )
}
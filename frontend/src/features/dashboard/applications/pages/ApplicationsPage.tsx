import { Briefcase, ListFilter, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { ApplicationCard } from "../components/ApplicationCard";
import { FilterMenu } from "../components/FilterMenu";
import { useQuery } from "@tanstack/react-query";
import jobApplicationService, { type SearchJobApplicationsParams } from "../api/jobApplicationService";
import { CreateModal } from "../components/crud_modals/CreateModal";
import { EmptyApplications } from "../components/EmptyApplications";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "../../../../shared/ui/Pagination";
import { usePaginationMetadata } from "../../../../shared/hooks/usePaginationMetadata";
import { getSearchParamNumber } from "../utils/getSearchParamNumber";
import type { Position } from "../models/Position";
import type { Status } from "../models/Status";

const DEFAULT_APPLICATIONS_PAGE = 0;
const DEFAULT_APPLICATIONS_PAGE_SIZE = 10;
const APPLICATIONS_PAGE_SIZE_OPTIONS = [5, 10, 20];

export function ApplicationsPage() {

    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedName = searchParams.get("name") ?? "";
    const showFavoritesOnly = searchParams.get("favorites") === "true";
    const requestedStatuses = searchParams.getAll("statuses") as Status[];
    const requestedPositions = searchParams.getAll("positions") as Position[];
    const requestedSort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

    const requestedPage = getSearchParamNumber(
        searchParams.get("page"),
        DEFAULT_APPLICATIONS_PAGE,
        0,
    );

    const requestedPageSizeParam = getSearchParamNumber(
        searchParams.get("size"),
        DEFAULT_APPLICATIONS_PAGE_SIZE,
        1,
    );
    const requestedPageSize = APPLICATIONS_PAGE_SIZE_OPTIONS.includes(requestedPageSizeParam)
        ? requestedPageSizeParam
        : DEFAULT_APPLICATIONS_PAGE_SIZE;

    const searchApplicationsParams: SearchJobApplicationsParams = {
        name: requestedName || undefined,
        statuses: requestedStatuses.length ? requestedStatuses : undefined,
        positions: requestedPositions.length ? requestedPositions : undefined,
        favorites: showFavoritesOnly ? true : undefined,
        sort: requestedSort,
        page: requestedPage,
        size: requestedPageSize,
    };

    const { data: applications, isLoading, isError } = useQuery({
        queryKey: ["applications", searchApplicationsParams],
        queryFn: () => jobApplicationService.searchJobApplications(searchApplicationsParams),
        staleTime: 1000 * 60 * 5
    });

    const applicationsList = applications?.content ?? [];
    const empty = applicationsList.length === 0;


    const { currentPage, totalPages, canGoToPreviousPage, canGoToNextPage } = usePaginationMetadata(applications, requestedPage);

    const handleSearch = (name: string) => {
        const nextSearchName = name.trim();
        const nextSearchParams = new URLSearchParams(searchParams);

        if (nextSearchName) {
            nextSearchParams.set("name", nextSearchName);
        } else {
            nextSearchParams.delete("name");
        }

        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(requestedPageSize));
        setSearchParams(nextSearchParams);
    };

    const updatePaginationParams = (nextPage: number) => {
        const nextSearchParams = new URLSearchParams(searchParams);
        const page = Math.max(nextPage, DEFAULT_APPLICATIONS_PAGE);

        nextSearchParams.set("page", String(page));
        nextSearchParams.set("size", String(requestedPageSize));

        setSearchParams(nextSearchParams);
    };

    const updatePageSizeParam = (nextPageSize: number) => {
        const nextSearchParams = new URLSearchParams(searchParams);

        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(nextPageSize));

        setSearchParams(nextSearchParams);
    };

    const updateFavoritesFilter = (checked: boolean) => {
        const nextSearchParams = new URLSearchParams(searchParams);

        if (checked) {
            nextSearchParams.set("favorites", "true");
        } else {
            nextSearchParams.delete("favorites");
        }

        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(requestedPageSize));

        setSearchParams(nextSearchParams);
    };

    const resetFilters = () => {
        const nextSearchParams = new URLSearchParams(searchParams);

        nextSearchParams.delete("name");
        nextSearchParams.delete("favorites");
        nextSearchParams.delete("statuses");
        nextSearchParams.delete("positions");
        nextSearchParams.delete("sort");
        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(requestedPageSize));

        setSearchParams(nextSearchParams);
    };

    const updateStatusFilter = (status: Status) => {
        const nextSearchParams = new URLSearchParams(searchParams);
        const nextStatuses = requestedStatuses.includes(status)
            ? requestedStatuses.filter((selectedStatus) => selectedStatus !== status)
            : [...requestedStatuses, status];

        nextSearchParams.delete("statuses");
        nextStatuses.forEach((selectedStatus) => nextSearchParams.append("statuses", selectedStatus));
        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(requestedPageSize));
        setSearchParams(nextSearchParams);
    };

    const updatePositionFilter = (position: Position) => {
        const nextSearchParams = new URLSearchParams(searchParams);
        const nextPositions = requestedPositions.includes(position)
            ? requestedPositions.filter((selectedPosition) => selectedPosition !== position)
            : [...requestedPositions, position];

        nextSearchParams.delete("positions");
        nextPositions.forEach((selectedPosition) => nextSearchParams.append("positions", selectedPosition));
        nextSearchParams.set("page", String(DEFAULT_APPLICATIONS_PAGE));
        nextSearchParams.set("size", String(requestedPageSize));
        setSearchParams(nextSearchParams);
    };

    return (
        <section className="min-h-screen bg-zinc-50 p-4 sm:p-6 dark:bg-dark-background">

            <DashboardHeader Icon={Briefcase} title={"Your Applications"} />

            <div className="mt-8">
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
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 ">
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
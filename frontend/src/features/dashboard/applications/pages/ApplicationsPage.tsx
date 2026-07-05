import { Briefcase, ListFilter, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { ApplicationCard } from "../components/ApplicationCard";
import { FilterMenu } from "../components/FilterMenu";
import { useQuery } from "@tanstack/react-query";
import jobApplicationService from "../api/jobApplicationService";
import { CreateModal } from "../components/crud_modals/CreateModal";
import { EmptyApplications } from "../components/EmptyApplications";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "../../../../shared/ui/Pagination";
import { usePaginationMetadata } from "../../../../shared/hooks/usePaginationMetadata";
import { getSearchParamNumber } from "../utils/getSearchParamNumber";

const DEFAULT_APPLICATIONS_PAGE = 0;
const DEFAULT_APPLICATIONS_PAGE_SIZE = 10;

export function ApplicationsPage() {

    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const showFavoritesOnly = searchParams.get("favorites") === "true";

    const requestedPage = getSearchParamNumber(
        searchParams.get("page"),
        DEFAULT_APPLICATIONS_PAGE,
        0,
    );

    const requestedPageSize = getSearchParamNumber(
        searchParams.get("size"),
        DEFAULT_APPLICATIONS_PAGE_SIZE,
        1,
    );

    const { data: applications, isLoading, isError } = useQuery({
        queryKey: ["applications", { page: requestedPage, size: requestedPageSize }],
        queryFn: () => jobApplicationService.allJobApplications(requestedPage, requestedPageSize),
        staleTime: 1000 * 60 * 5
    });

    const applicationsList = applications?.content ?? [];
    const empty = applicationsList.length === 0;


    const { currentPage, totalPages, canGoToPreviousPage, canGoToNextPage } = usePaginationMetadata(applications, requestedPage);

    const updatePaginationParams = (nextPage: number) => {
        const nextSearchParams = new URLSearchParams(searchParams);

        nextSearchParams.set("page", String(Math.max(nextPage, DEFAULT_APPLICATIONS_PAGE)));
        nextSearchParams.set("size", String(requestedPageSize));

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

        nextSearchParams.delete("favorites");
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
                            <div className="absolute left-0 top-full z-20 mt-2">
                                <FilterMenu
                                    showFavoritesOnly={showFavoritesOnly}
                                    onShowFavoritesOnlyChange={updateFavoritesFilter}
                                    onResetFilters={resetFilters}
                                    onApplyFilters={() => setIsFilterMenuOpen(false)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-2xl flex-1 min-w-[280px]">
                        <SearchInput className="rounded-none!" placeholder="Search applications..." />
                    </div>
                </div>

                <CreateModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                />

                {isLoading ? (
                    <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">Loading applications...</p>
                ) : isError ? (
                    <p className="mt-6 text-sm text-rose-600 dark:text-rose-400">Could not load applications.</p>
                ) : empty ? (
                    <EmptyApplications />
                ) : (
                    <>
                        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">Total applications: {applications?.page.totalElements}</p>
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
                            totalPages={totalPages}
                            canPrevious={canGoToPreviousPage}
                            canNext={canGoToNextPage}
                            onPrevious={() => updatePaginationParams(currentPage - 1)}
                            onNext={() => updatePaginationParams(currentPage + 1)}
                            onPageChange={updatePaginationParams}
                        />
                    </>
                )}
            </div>

        </section>
    )
}
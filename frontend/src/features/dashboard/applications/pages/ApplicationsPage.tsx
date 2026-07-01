import { useState } from "react";
import { Briefcase, ListFilter, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { Button } from "../../../../shared/ui/Button";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import { ApplicationCard } from "../components/ApplicationCard";
import { FilterMenu, type FilterValue } from "../components/FilterMenu";
import { Position, Status, type JobApplicationDto } from "../models/JobApplicationDto";

const dummyApplications: JobApplicationDto[] = [
    {
        id: "1",
        name: "application1",
        city: "city1",
        status: Status.IN_PROGRESS,
        position: Position.FULLSTACK,
        isFavorite: true,
        appliedAt: "2026-06-21T10:30:00Z",
    },
    {
        id: "2",
        name: "application2",
        city: "city2",
        status: Status.PENDING,
        position: Position.BACKEND,
        isFavorite: false,
        appliedAt: "2026-06-25T14:15:00Z",
    },
    {
        id: "3",
        name: "application3",
        city: "city3",
        status: Status.ACCEPTED,
        position: Position.FRONTEND,
        isFavorite: true,
        appliedAt: "2026-06-15T08:00:00Z",
    },
    {
        id: "4",
        name: "application4",
        city: "city4",
        status: Status.REJECTED,
        position: Position.QA,
        isFavorite: false,
        appliedAt: "2026-06-05T16:45:00Z",
    },
];

export function ApplicationsPage() {

    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const filterParam = searchParams.get("filter");
    const selectedFilter: FilterValue | null =
        filterParam === "favorites" || filterParam === "in-progress" || filterParam === "recent"
            ? filterParam
            : null;

    // const {} = useQuery({
    //     queryKey: ["applications"],
    //     queryFn:
    // })

    const handleSelectFilter = (filter: FilterValue) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("filter", filter);
        setSearchParams(nextParams);
        setIsFilterMenuOpen(false);
    };
    
    return (
        <section className="min-h-screen bg-zinc-50 p-4 sm:p-6 dark:bg-dark-background">

            <DashboardHeader Icon={Briefcase} title={"Your Applications"} />

            <div className="mt-8">
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <div className="w-full max-w-2xl flex-1 min-w-[280px]">
                        <SearchInput placeholder="Search applications..." />
                    </div>

                    <div className="relative">
                        <Button
                            variant="secondary"
                            leftIcon={<ListFilter size={16} />}
                            onClick={() => setIsFilterMenuOpen((prev) => !prev)}
                        >
                            Filter
                        </Button>

                        {isFilterMenuOpen && (
                            <div className="absolute right-0 top-full z-20 mt-2">
                                <FilterMenu
                                    selectedFilter={selectedFilter}
                                    onSelectFilter={handleSelectFilter}
                                />
                            </div>
                        )}
                    </div>

                    <Button leftIcon={<Plus size={16} />}>Add Application</Button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {dummyApplications.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                    ))}
                </div>
            </div>
            
        </section>
    )
}
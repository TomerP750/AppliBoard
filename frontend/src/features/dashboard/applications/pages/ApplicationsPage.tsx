import { useState } from "react";
import { Briefcase, ListFilter, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { Button } from "../../../../shared/ui/Button";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import { ApplicationCard } from "../components/ApplicationCard";
import { FilterMenu, type FilterValue } from "../components/FilterMenu";
import { CreateModal } from "../components/CreateModal";
import { EmptyApplications } from "../components/EmptyApplications";
import { useQuery } from "@tanstack/react-query";
import jobApplicationService from "../api/jobApplicationService";


export function ApplicationsPage() {

    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const filterParam = searchParams.get("filter");

    const { data: applications } = useQuery({
        queryKey: ["applications"],
        queryFn: () => jobApplicationService.allJobApplications(),
    });

    const empty = !applications?.data || applications.data.length === 0;
    
    // const selectedFilter: FilterValue | null =
    //     filterParam === "favorites" || filterParam === "in-progress" || filterParam === "recent"
    //         ? filterParam
    //         : null;

    // const handleSelectFilter = (filter: FilterValue) => {
    //     const nextParams = new URLSearchParams(searchParams);
    //     nextParams.set("filter", filter);
    //     setSearchParams(nextParams);
    //     setIsFilterMenuOpen(false);
    // };

    return (
        <section className="min-h-screen bg-zinc-50 p-4 sm:p-6 dark:bg-dark-background">

            <DashboardHeader Icon={Briefcase} title={"Your Applications"} />

            <div className="mt-8">
                <div className="flex flex-wrap items-center gap-2">

                    <Button
                        onClick={() => setAddModalOpen(true)}
                        leftIcon={<Plus
                            size={16} />}>
                        Add Application
                    </Button>

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
                                {/* <FilterMenu
                                    selectedFilter={selectedFilter}
                                    onSelectFilter={handleSelectFilter}
                                /> */}
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-2xl flex-1 min-w-[280px]">
                        <SearchInput placeholder="Search applications..." />
                    </div>
                </div>

                <CreateModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />

                {empty ? (
                    <EmptyApplications />
                ) : (
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {applications?.data.map((application) => (
                            <ApplicationCard key={application.id} application={application} />
                        ))}
                    </div>
                )}
            </div>

        </section>
    )
}
import { Briefcase, ListFilter, Plus } from "lucide-react";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { Button } from "../../../../shared/ui/Button";
import { SearchInput } from "../../../../shared/ui/SearchInput";


export function ApplicationsPage() {

    // const {} = useQuery({
    //     queryKey: ["applications"],
    //     queryFn:
    // })
    
    return (
        <section className="min-h-screen bg-zinc-50 p-4 sm:p-6 dark:bg-dark-background">

            <DashboardHeader Icon={Briefcase} title={"Your Applications"} />

            <div className="mt-8">
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <div className="w-full max-w-2xl flex-1 min-w-[280px]">
                        <SearchInput placeholder="Search applications..." />
                    </div>

                    <Button variant="secondary" leftIcon={<ListFilter size={16} />}>
                        Filter
                    </Button>

                    <Button leftIcon={<Plus size={16} />}>Add Application</Button>
                </div>
            </div>
        </section>
    )
}
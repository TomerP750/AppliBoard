import { ArrowRightIcon, HistoryIcon } from "lucide-react";
import { Button } from "../../../../shared/ui/Button";


export function ActivitySection() {
    return (
        <section className="px-5 py-5 h-80 bg-white dark:bg-[#0d111d] rounded-xl border border-black/10 dark:border-white/10">
            <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-5">
                <h2 className="inline-flex items-center gap-2 text-lg font-medium dark:text-white">
                    <HistoryIcon className="w-5 h-5" />
                    Recent Activity
                </h2>
                <Button
                    rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                    variant="ghost"
                    className="text-indigo-400!">View All</Button>
            </div>
        </section>
    )
}
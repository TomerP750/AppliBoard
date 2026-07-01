import { Briefcase, Plus } from "lucide-react";
import { Button } from "../../../../shared/ui/Button";
import { useState } from "react";
import { CreateModal } from "./CreateModal";

export function EmptyApplications() {

    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

    return (
        <div className="mt-10 flex min-h-[360px] items-center justify-center rounded-2xl p-8 text-center shadow-sm dark:border-zinc-700">
            <div className="flex max-w-sm flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full">
                    <Briefcase size={30} aria-hidden="true" className="text-zinc-400 dark:text-white" />
                </div>

                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    No applications found
                </h2>

                <p className="mt-2 mb-5 text-sm text-zinc-500 dark:text-zinc-400">
                    Start tracking your job applications by adding your first one.
                </p>

                <Button onClick={() => setAddModalOpen(true)} variant="secondary" leftIcon={<Plus size={16} />}>Add Application</Button>
            </div>

            <CreateModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
        </div>
    );
}

import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { Modal } from "../../../../shared/ui/Modal";
import { toTitleCase } from "../../../../shared/util/toTitleCase";
import { Position, Status } from "../models/JobApplicationDto";


interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateModal({ isOpen, onClose }: CreateModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <form className="mx-auto flex w-full max-w-sm flex-col gap-5">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        Create Application
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Add the job details you want to track.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <Input label="Company Name" placeholder="Acme Inc." />
                    <Input label="City" placeholder="Tel Aviv" />

                    <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Status
                        <select
                            defaultValue=""
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                        >
                            <option value="" disabled>
                                Select status
                            </option>
                            {Object.values(Status).map((status) => (
                                <option key={status} value={status}>
                                    {toTitleCase(status)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Position
                        <select
                            defaultValue=""
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                        >
                            <option value="" disabled>
                                Select position
                            </option>
                            {Object.values(Position).map((position) => (
                                <option key={position} value={position}>
                                    {toTitleCase(position)}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="flex justify-center gap-3 pt-10">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button>
                        Create
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
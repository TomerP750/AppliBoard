import { AlertTriangleIcon, Trash2Icon } from "lucide-react";
import { Button } from "../../../../shared/ui/Button";
import { Modal } from "../../../../shared/ui/Modal";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

export function DeleteModal({ isOpen, onClose, onDelete }: DeleteModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            className="overflow-hidden border-rose-200 p-0 shadow-2xl shadow-rose-950/10 dark:border-rose-950/60 dark:shadow-black/40"
        >
            <div className="relative px-6 pb-6 ">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-100 text-rose-600 shadow-sm shadow-rose-900/10 dark:border-rose-900/60 dark:bg-rose-950/70 dark:text-rose-300">
                    <Trash2Icon size={26} aria-hidden="true" />
                </div>

                <div className="mt-5 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Delete application?
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        This will permanently remove this application from your board. You will not be able to recover it later.
                    </p>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-white/80 p-3 text-left text-sm text-rose-700 shadow-sm dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200">
                    <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <p>
                        Make sure this is the right application before confirming.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="w-full border-zinc-300 bg-white/90 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onDelete}
                        leftIcon={<Trash2Icon size={17} />}
                        className="w-full bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700 focus:ring-rose-500/40 dark:bg-rose-500 dark:hover:bg-rose-400"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
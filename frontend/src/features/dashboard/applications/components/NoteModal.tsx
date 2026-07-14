import { Modal } from "../../../../shared/ui/Modal";

interface NoteModalProps {
    title: string;
    note: string;
    isOpen: boolean;
    onClose: () => void;
}

export function NoteModal({ title, note, isOpen, onClose }: NoteModalProps) {

    if (!isOpen) return null;

    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{note}</p>
        </Modal>
    );
}
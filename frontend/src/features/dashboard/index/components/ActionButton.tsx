import type { LucideIcon } from "lucide-react";

type ActionButtonProps = {
    title: string;
    Icon: LucideIcon;
    onClick: () => void;
};

export function ActionButton({ title, Icon, onClick }: ActionButtonProps) {
    
    return (
        <button
            onClick={onClick}
            className="aspect-square w-full rounded-xl h-50 border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f19] hover:bg-black/5 dark:hover:bg-white/5 transition flex flex-col items-center justify-center gap-3"
        >
            <Icon className="w-7 h-7 text-gray-700 dark:text-gray-200" />

            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {title}
            </span>

            <span className="text-xs text-gray-500 dark:text-gray-400">
                Go to
            </span>

        </button>
    );
}
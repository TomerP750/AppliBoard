import type { LucideIcon } from "lucide-react";

interface RowCardProps {
    Icon: LucideIcon;
    text: any | string;
}

export function RowCard({ Icon, text }: RowCardProps) {

    return (
        <div className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            <Icon size={18} aria-hidden="true" />
            <p className="text-sm text-zinc-500 dark:text-white/70 font-normal">{text}</p>
        </div>
    );
    
}
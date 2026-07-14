import type { LucideIcon } from "lucide-react";

interface RowCardProps {
    Icon: LucideIcon;
    text: any | string;
    className?: string;
    textClassName?: string;
}

export function RowCard({ Icon, text, className, textClassName }: RowCardProps) {

    return (
        <div className={`inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 ${className}`}>
            <Icon size={18} aria-hidden="true" />
            <p className={`text-sm text-zinc-500 dark:text-white/70 font-normal ${textClassName}`}>{text}</p>
        </div>
    );
    
}
import type { LucideIcon } from "lucide-react";

interface NotificationRowProps {
    Icon: LucideIcon;
    title: string;
    message: string;
    time: string;
    dateTime?: string;
}

export function NotificationRow({
    Icon,
    title,
    message,
    time,
    dateTime,
}: NotificationRowProps) {
    return (
        <li>
            <article className="flex gap-3 px-4 py-4 transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/60 sm:px-5">
                <span className="dark:text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                    <header className="flex items-start justify-between gap-3">
                        <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {title}
                        </h3>
                        <time
                            dateTime={dateTime}
                            className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400"
                        >
                            {time}
                        </time>
                    </header>
                    <p className="mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
                        {message}
                    </p>
                </div>
            </article>
        </li>
    );
}
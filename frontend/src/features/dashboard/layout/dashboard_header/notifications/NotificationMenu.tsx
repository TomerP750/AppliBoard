import { Clock } from "lucide-react";
import { NotificationRow } from "./NotificationRow";

interface NotificationMenuProps {
    open: boolean;
}

export function NotificationMenu({ open }: NotificationMenuProps) {
    if (!open) return null;

    return (
        <section
            aria-labelledby="notifications-heading"
            className="absolute right-0 top-full z-50 mt-3 flex max-h-[min(32rem,calc(100vh-6rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 shadow-2xl shadow-zinc-950/10 backdrop-blur-xl dark:border-zinc-700/80 dark:bg-zinc-900/95 dark:shadow-black/30"
        >
            <header className="shrink-0 border-b border-zinc-200/80 px-4 py-3.5 dark:border-zinc-700/80 sm:px-5">
                <h2
                    id="notifications-heading"
                    className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
                >
                    Notifications
                </h2>
            </header>

            <ol className="min-h-32 flex-1 divide-y divide-zinc-200/80 overflow-y-auto dark:divide-zinc-700/80">
                <NotificationRow
                    Icon={Clock}
                    title="Job Application Name"
                    message="This job application hasn't been updated in the past two weeks."
                    time="2 min ago"
                />
            </ol>
        </section>
    );
}


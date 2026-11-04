import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type CvToolCardProps = {
    to: string;
    Icon: LucideIcon;
    title: string;
    description: string;
    action: string;
};

export function CvToolCard({ to, Icon, title, description, action }: CvToolCardProps) {
    return (
        <Link to={to} className="group flex min-w-0 flex-col gap-5 rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/50 sm:p-6">
            <div className="flex items-center gap-3">
                <Icon aria-hidden="true" className="size-5 shrink-0 text-zinc-600 dark:text-zinc-400" />
                <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">{title}</h3>
            </div>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
            <span className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">{action}<ArrowRight aria-hidden="true" className="size-4" /></span>
        </Link>
    );
}

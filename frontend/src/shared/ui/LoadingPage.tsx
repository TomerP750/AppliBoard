import type { HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export type LoadingPageProps = HTMLAttributes<HTMLDivElement> & {
    /** Optional message shown beneath the spinner. */
    message?: string;
    /** Fill the whole viewport (default) or just the parent container. */
    fullScreen?: boolean;
};

export function LoadingPage({
    message = "Loading...",
    fullScreen = true,
    className = "",
    ...props
}: LoadingPageProps) {
    const containerClasses = [
        "flex flex-col items-center justify-center gap-4",
        fullScreen
            ? "min-h-screen bg-dark-background text-white"
            : "h-full w-full py-16 text-zinc-600 dark:text-zinc-300",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={containerClasses} role="status" aria-live="polite" {...props}>
            <Loader2
                className="h-10 w-10 animate-spin text-brand-primary"
                aria-hidden="true"
            />
            {message && (
                <p className="text-sm font-medium opacity-80">{message}</p>
            )}
            <span className="sr-only">{message}</span>
        </div>
    );
}

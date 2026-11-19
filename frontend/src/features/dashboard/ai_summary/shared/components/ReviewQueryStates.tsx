import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "../../../../../shared/ui/Button";

const cardClasses =
    "flex flex-col items-center justify-center gap-3 rounded-3xl border border-zinc-200/80 bg-white px-5 py-14 text-center shadow-sm dark:border-white/8 dark:bg-zinc-900/70 dark:shadow-none";

type ReviewLoadingProps = {
    label: string;
};

export function ReviewLoading({ label }: ReviewLoadingProps) {
    return (
        <div className={cardClasses} role="status">
            <Loader2 className="size-6 animate-spin text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{label}</p>
        </div>
    );
}

type ReviewLoadErrorProps = {
    message: string;
    onRetry: () => void;
};

export function ReviewLoadError({ message, onRetry }: ReviewLoadErrorProps) {
    return (
        <div className={cardClasses} role="alert">
            <span className="grid size-10 place-items-center rounded-xl bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300">
                <AlertCircle className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{message}</p>
            <Button variant="secondary" leftIcon={<RotateCcw className="size-4" aria-hidden="true" />} onClick={onRetry}>
                Try again
            </Button>
        </div>
    );
}

import { useEffect, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
    type: ToastType;
    message: string;
    className?: string;
    duration?: number;
    onClose?: () => void;
    icon?: ReactNode;
}

export function Toast({ type, message, className = "", duration = 10000, onClose, icon }: ToastProps) {
    
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => window.clearTimeout(timeoutId);
    }, [duration, onClose]);

    if (!isVisible) {
        return null;
    }

    const typeClasses: Record<ToastType, string> = {
        success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
        error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
        warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
    };

    const toastClasses = [
        "border px-4 py-3 text-sm font-medium shadow-sm",
        "flex items-center gap-3",
        typeClasses[type],
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div role="status" aria-live="polite" className={toastClasses}>
            {icon ? <span className="shrink-0">{icon}</span> : null}
            <span>{message}</span>
        </div>
    );
}
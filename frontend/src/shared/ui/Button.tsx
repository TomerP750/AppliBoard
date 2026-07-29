import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "headless";
type ButtonSize = "sm" | "md";

const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary/40",
    secondary:
        "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 focus:ring-brand-primary/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
    ghost:
        "bg-transparent text-zinc-700 hover:bg-zinc-100 focus:ring-brand-primary/30 dark:text-zinc-200 dark:hover:bg-zinc-800",
    headless: "",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        type = "button",
        variant = "primary",
        size = "md",
        leftIcon,
        rightIcon,
        loading = false,
        className = "",
        disabled,
        children,
        ...props
    },
    ref,
) {
    const buttonClasses =
        variant === "headless"
            ? className
            : [baseClasses, variantClasses[variant], sizeClasses[size], className]
                .filter(Boolean)
                .join(" ");

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            className={buttonClasses}
            aria-busy={loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
                <>
                    {leftIcon}
                    {children}
                    {rightIcon}
                </>
            )}
        </button>
    );
});

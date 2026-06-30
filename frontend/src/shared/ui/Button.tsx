import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        type = "button",
        variant = "primary",
        size = "md",
        leftIcon,
        rightIcon,
        className = "",
        disabled,
        children,
        ...props
    },
    ref,
) {
    const variantClasses: Record<ButtonVariant, string> = {
        primary:
            "bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary/40",
        secondary:
            "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 focus:ring-brand-primary/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
        ghost:
            "bg-transparent text-zinc-700 hover:bg-zinc-100 focus:ring-brand-primary/30 dark:text-zinc-200 dark:hover:bg-zinc-800",
    };

    const sizeClasses: Record<ButtonSize, string> = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
    };

    const buttonClasses = [
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition",
        "focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button ref={ref} type={type} disabled={disabled} className={buttonClasses} {...props}>
            {leftIcon}
            {children}
            {rightIcon}
        </button>
    );
});

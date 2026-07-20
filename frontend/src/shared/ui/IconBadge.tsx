import type { HTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

type CountPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

type CountTheme = "danger" | "warning" | "success" | "info";

export type IconBadgeProps = HTMLAttributes<HTMLDivElement> & {
    count?: number;
    countPosition?: CountPosition;
    countTheme?: CountTheme;
    Icon?: LucideIcon;
    onClick?: () => void;
};

export function IconBadge({
    count = 0,
    countPosition = "top-right",
    countTheme = "danger",
    Icon,
    onClick,
    className = "",
    children,
    ...props
}: IconBadgeProps) {
    const positionClasses: Record<CountPosition, string> = {
        "top-right": "right-0 top-0 -translate-y-1/2 translate-x-1/2",
        "top-left": "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
        "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
        "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
    };

    const themeClasses: Record<CountTheme, string> = {
        danger: "bg-red-500 text-white",
        warning: "bg-amber-500 text-white",
        success: "bg-emerald-500 text-white",
        info: "bg-blue-500 text-white",
    };

    const iconBadgeClasses = ["relative inline-flex", className]
        .filter(Boolean)
        .join(" ");

    const countClasses = [
        "absolute inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold",
        positionClasses[countPosition],
        themeClasses[countTheme],
    ].join(" ");

    return (
        <div className={iconBadgeClasses} {...props}>
            <button
                type="button"
                onClick={onClick}
                className="cursor-pointer">
                {Icon && <Icon className="dark:text-white w-5 h-5" />}
            </button>
            {children}
            {count > 0 && <span className={countClasses}>{count}</span>}
        </div>
    );
}
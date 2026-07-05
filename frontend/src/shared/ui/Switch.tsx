import { useState, type ButtonHTMLAttributes, type MouseEvent } from "react";

export type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
    checked,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    onClick,
    className = "",
    ...props
}: SwitchProps) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isChecked = checked ?? internalChecked;

    const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented || disabled) {
            return;
        }

        const nextChecked = !isChecked;

        if (checked === undefined) {
            setInternalChecked(nextChecked);
        }

        onCheckedChange?.(nextChecked);
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            disabled={disabled}
            onClick={handleToggle}
            className={[
                "inline-flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
                isChecked ? "bg-brand-primary" : "bg-zinc-200 dark:bg-zinc-700",
                disabled && "cursor-not-allowed opacity-60",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...props}
        >
            <span
                className={[
                    "h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                    isChecked ? "translate-x-5" : "translate-x-0",
                ]
                    .filter(Boolean)
                    .join(" ")}
            />
        </button>
    );
}

import { forwardRef, useId, type TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    helperText?: string;
    rows?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    {
        label,
        error,
        helperText,
        id,
        className = "",
        disabled,
        ...props
    },
    ref,
) {


    const generatedId = useId();
    const textareaId = id ?? generatedId;

    const describedBy =
        [error ? `${textareaId}-error` : null, helperText && !error ? `${textareaId}-helper` : null]
            .filter(Boolean)
            .join(" ") || undefined;

    return (
        <div className="flex flex-col gap-1.5">
            {label && <label htmlFor={textareaId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
            <textarea
                id={textareaId}
                aria-describedby={describedBy}
                className={`resize-none w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 dark:border-zinc-800 dark:bg-stone-800 dark:text-zinc-100 ${className}`}
                disabled={disabled}
                ref={ref}
                aria-invalid={error ? "true" : "false"}
                {...props}
            />
            {error && <p id={`${textareaId}-error`} className="text-sm text-red-500">{error}</p>}
            {helperText && <p id={`${textareaId}-helper`} className="text-sm text-zinc-500">{helperText}</p>}
        </div>
    );
});
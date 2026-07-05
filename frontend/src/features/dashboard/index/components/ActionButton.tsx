import type { LucideIcon } from "lucide-react";
import { Button } from "../../../../shared/ui/Button";

// all referenced to tailwind 400 colors
type ColorType = "indigo" | "sky" | "emerald"

type ActionButtonProps = {
    title: string;
    description: string;
    Icon: LucideIcon;
    onClick: () => void;
    color: ColorType;
};

export function ActionButton({ title, Icon, onClick, color, description }: ActionButtonProps) {

    const accentClasses = {
        indigo: {
            icon: "bg-indigo-400/10 text-indigo-400 ring-indigo-400/20",
            watermark: "text-indigo-400/10",
            glow: "bg-indigo-400/25",
            button: "!bg-indigo-400 hover:!bg-indigo-500 focus:!ring-indigo-400/40",
        },
        sky: {
            icon: "bg-sky-400/10 text-sky-400 ring-sky-400/20",
            watermark: "text-sky-400/10",
            glow: "bg-sky-400/25",
            button: "!bg-sky-400 hover:!bg-sky-500 focus:!ring-sky-400/40",
        },
        emerald: {
            icon: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
            watermark: "text-emerald-400/10",
            glow: "bg-emerald-400/25",
            button: "!bg-emerald-400 hover:!bg-emerald-500 focus:!ring-emerald-400/40",
        },
    }[color];

    return (
        <article
            className="relative flex aspect-square h-50 w-full flex-col justify-between 
            overflow-hidden rounded-xl border border-black/10 
            bg-white p-5 shadow-sm transition 
            hover:scale-105 
            dark:border-white/10 dark:bg-[#0d111d]"
        >
            <div className={`absolute -right-10 -bottom-10 h-28 w-28 rounded-full blur-3xl ${accentClasses.glow}`} />
            <Icon
                strokeWidth={1}
                className={`pointer-events-none absolute -bottom-5 -right-4 h-32 w-32 ${accentClasses.watermark}`}
                aria-hidden="true"
            />

            <div className="relative flex items-start gap-4">
                <div className={`rounded-xl p-3 ring-1 ${accentClasses.icon}`}>
                    <Icon className="h-7 w-7" />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {title}
                    </span>

                    <span className="text-xs leading-5 text-gray-600 dark:text-gray-400">
                        {description}
                    </span>
                </div>
            </div>

            <Button
                onClick={onClick}
                className={`relative w-fit ${accentClasses.button}`}
            >
                Go to {title}
            </Button>

        </article>
    );
}
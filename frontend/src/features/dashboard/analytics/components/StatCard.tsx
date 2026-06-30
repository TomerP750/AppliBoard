import type { LucideIcon } from "lucide-react";

type StatCardProps = {
    title: string;
    value: number | string;
    color?: "default" | "blue" | "green" | "amber" | "red" | "sky";
    icon?: LucideIcon;
};

const colorMap = {
    default: {
        text: "text-zinc-900 dark:text-zinc-100",
        icon: "text-zinc-500 dark:text-zinc-400",
    },
    blue: {
        text: "text-blue-600 dark:text-blue-400",
        icon: "text-blue-500 dark:text-blue-400",
    },
    green: {
        text: "text-emerald-600 dark:text-emerald-400",
        icon: "text-emerald-500 dark:text-emerald-400",
    },
    amber: {
        text: "text-amber-600 dark:text-amber-400",
        icon: "text-amber-500 dark:text-amber-400",
    },
    red: {
        text: "text-red-600 dark:text-red-400",
        icon: "text-red-500 dark:text-red-400",
    },
    sky: {
    text: "text-sky-600 dark:text-sky-400",
    icon: "text-sky-500 dark:text-sky-400",
},
} as const;

export function StatCard({title,value,color = "default",icon: Icon,}: StatCardProps) {
    return (
        <article className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {title}
                </p>

                {Icon && (
                    <Icon
                        size={18}
                        className={colorMap[color].icon}
                    />
                )}
            </div>

            <div className={`mt-2 text-2xl font-semibold ${colorMap[color].text}`}>
                {value}
            </div>
        </article>
    );
}
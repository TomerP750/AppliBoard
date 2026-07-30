import { TrendingDown, TrendingUp, Minus, type LucideIcon } from "lucide-react";
import { SummaryTrend } from "../../current/models/AiSummaryResponse";

export type TrendStyle = {
    label: string;
    icon: LucideIcon;
    container: string;
    iconStyle: string;
    accent: string;
    hover: string;
};

export function getTrendStyle(trend: SummaryTrend): TrendStyle {
    switch (trend) {
        case SummaryTrend.UP:
            return {
                label: "Trending up",
                icon: TrendingUp,
                container:
                    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
                iconStyle: "text-emerald-600 dark:text-emerald-300",
                accent: "bg-emerald-500",
                hover: "hover:border-emerald-300 hover:shadow-emerald-200/50 dark:hover:border-emerald-500/40",
            };
        case SummaryTrend.DOWN:
            return {
                label: "Trending down",
                icon: TrendingDown,
                container:
                    "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
                iconStyle: "text-red-600 dark:text-red-300",
                accent: "bg-red-500",
                hover: "hover:border-red-300 hover:shadow-red-200/50 dark:hover:border-red-500/40",
            };
        default:
            return {
                label: "Holding steady",
                icon: Minus,
                container:
                    "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/15 dark:bg-white/5 dark:text-white",
                iconStyle: "text-zinc-500 dark:text-white",
                accent: "bg-zinc-300 dark:bg-white/40",
                hover: "hover:border-zinc-300 hover:shadow-zinc-200/60 dark:hover:border-white/25",
            };
    }
}

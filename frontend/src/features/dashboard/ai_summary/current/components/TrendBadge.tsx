import type { SummaryTrend } from "../models/AiSummaryResponse";
import { getTrendStyle } from "../../shared/utils/getTrendStyle";

type TrendBadgeProps = {
    trend: SummaryTrend;
};

export function TrendBadge({ trend }: TrendBadgeProps) {
    const { label, icon: Icon, container, iconStyle } = getTrendStyle(trend);

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${container}`}
        >
            <Icon className={`size-4 ${iconStyle}`} strokeWidth={2} />
            {label}
        </span>
    );
}

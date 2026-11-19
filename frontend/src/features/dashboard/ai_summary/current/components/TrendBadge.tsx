import type { ReviewTrend } from "../models/ReviewTrend";
import { getTrendStyle } from "../../shared/utils/getTrendStyle";

type TrendBadgeProps = {
    trend: ReviewTrend;
};

export function TrendBadge({ trend }: TrendBadgeProps) {
    const { label, icon: Icon, container, iconStyle } = getTrendStyle(trend);

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${container}`}
        >
            <Icon className={`size-4 ${iconStyle}`} strokeWidth={2} aria-hidden="true" />
            {label}
        </span>
    );
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const dayMonthFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const fullDateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const nextAvailableFormat = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});

/** "Nov 15 – Nov 21, 2026". weekEnd is exclusive, so the last shown day is the day before it. */
export function formatWeekRange(weekStart: string, weekEnd: string): string {
    const lastDay = new Date(new Date(weekEnd).getTime() - DAY_IN_MS);
    return `${dayMonthFormat.format(new Date(weekStart))} – ${fullDateFormat.format(lastDay)}`;
}

/** "Nov 22, 2026" */
export function formatReviewDate(isoDate: string): string {
    return fullDateFormat.format(new Date(isoDate));
}

/** "Sunday, Nov 29, 08:00" */
export function formatNextAvailableAt(isoDate: string): string {
    return nextAvailableFormat.format(new Date(isoDate));
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
    }).format(date);
}

export function formatTime(date: Date): string {
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}
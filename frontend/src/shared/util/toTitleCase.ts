

export function toTitleCase(str: string): string {
    return str
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
}
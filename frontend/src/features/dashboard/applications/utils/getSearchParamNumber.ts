export function getSearchParamNumber(value: string | null, fallback: number, minimum: number) {
    if (value === null) {
        return fallback;
    }

    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < minimum) {
        return fallback;
    }

    return parsedValue;
}
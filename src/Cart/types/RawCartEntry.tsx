export type RawCartEntry = {
    productId: number
}

export function isRawCartEntry(value: unknown): value is RawCartEntry {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const v = value as Record<string, unknown>;

    return (
        typeof v.productId === "number"
    );
}
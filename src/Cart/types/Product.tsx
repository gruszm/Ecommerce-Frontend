export type Product = {
    id: number,
    name: string,
    price: number,
    amount: number,
    imageIds: number[]
}

export function isProduct(value: unknown): value is Product {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const v = value as Record<string, unknown>;

    return (
        typeof v.id === "number" &&
        typeof v.name === "string" &&
        typeof v.price === "number" &&
        typeof v.amount === "number" &&
        Array.isArray(v.imageIds) &&
        v.imageIds.every(i => typeof i === "number")
    );
}
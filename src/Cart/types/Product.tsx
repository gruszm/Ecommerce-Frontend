export type Product = {
    productId: number,
    name: string,
    price: number,
    imageIds: number[]
}

export function isProduct(value: unknown): value is Product {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const v = value as Record<string, unknown>;

    return (
        typeof v.productId === "number" &&
        typeof v.name === "string" &&
        typeof v.price === "number" &&
        Array.isArray(v.imageIds) &&
        v.imageIds.every(i => typeof i === "number")
    );
}
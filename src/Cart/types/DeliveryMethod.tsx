export type DeliveryMethod = {
    id: number,
    name: string,
    price: number | string
}

export function isDeliveryMethod(value: unknown): value is DeliveryMethod {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const v = value as Record<string, unknown>;

    return (
        typeof v.id === "number" &&
        typeof v.name === "string" &&
        (typeof v.price === "number" || typeof v.price === "string")
    );
}

export function isDeliveryMethodArray(value: unknown): value is DeliveryMethod[] {
    return (
        Array.isArray(value) &&
        value.every(isDeliveryMethod)
    );
}
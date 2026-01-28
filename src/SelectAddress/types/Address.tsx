export type Address = {
    id: number,
    street: string,
    houseNumber: number,
    apartmentNumber?: number,
    city: string,
    postalCode: string,
    voivodeship: string,
    country: string
}

export function isAddress(value: unknown): value is Address {
    if (value === null || typeof value !== "object") {
        return false;
    }

    const v = value as Record<string, unknown>;

    return (
        typeof v.id === "number" &&
        typeof v.street === "string" &&
        typeof v.houseNumber === "number" &&
        (typeof v.apartmentNumber === "number" || typeof v.apartmentNumber === "undefined") &&
        typeof v.city === "string" &&
        typeof v.postalCode === "string" &&
        typeof v.voivodeship === "string" &&
        typeof v.country === "string"
    );
}
import { type RawCartEntry, isRawCartEntry } from "./RawCartEntry.tsx";

type _PopulatedCartEntry = {
    id: number,
    productName: string,
    quantity: number,
    price: number,
    imageIds: number[]
} & RawCartEntry

export type PopulatedCartEntry = {
    [K in keyof _PopulatedCartEntry]: _PopulatedCartEntry[K]
} & {}

export function isPopulatedCartEntry(value: unknown): value is PopulatedCartEntry {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (!isRawCartEntry(value)) {
        return false;
    }

    const v = value as Record<string, unknown>;

    return (
        typeof v.id === "number" &&
        typeof v.productName === "string" &&
        typeof v.quantity === "number" &&
        typeof v.price === "number" &&
        Array.isArray(v.imageIds) &&
        v.imageIds.every(i => typeof i === "number")
    );
}
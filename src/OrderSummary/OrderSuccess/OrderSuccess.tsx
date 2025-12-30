import "./OrderSuccess.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { buildGatewayUrl, buildPublicUrl, getPriceAsText } from "../../utils/api.js";

type Product = {
    productId: number,
    name: string,
    quantity: number,
    price: number,
    amount_total: number,
    imageIds: number[]
};

type ProductListResponse = {
    products: Product[]
};

function isProduct(value: unknown): value is Product {
    const v = value as Record<string, unknown>;

    return (
        typeof value === "object"
        && value !== null
        && "productId" in v
        && "name" in v
        && "quantity" in v
        && "price" in v
        && "amount_total" in v
        && "imageIds" in v
        && typeof v.productId === "number"
        && typeof v.name === "string"
        && typeof v.quantity === "number"
        && typeof v.price === "number"
        && typeof v.amount_total === "number"
        && Array.isArray(v.imageIds)
        && v.imageIds.every(i => (typeof i === "number"))
    );
}

export default function OrderSuccess() {
    const [urlSearchParams] = useSearchParams();
    const sessionId = urlSearchParams.get("session_id");
    const [products, setProducts] = useState<Product[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const sessionData = buildGatewayUrl(`/stripe/session/${sessionId}`);

        fetch(sessionData, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
        ).then(res => res.json()
        ).then((res: ProductListResponse) => {
            if (!Array.isArray(res.products) || !res.products.every(isProduct)) {
                setErrorMessage("Incorrect data type retrieved from the backend.");
            }
            else {
                setProducts(res.products);
            }
        }
        ).catch((error: Error) => {
            setErrorMessage(error.message);
        });
    }, [sessionId]);

    if (errorMessage) {
        return (
            <div>
                Wystąpił błąd: {errorMessage}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div>
                Ładowanie...
            </div>
        );
    }

    return (
        <div className="order-success-container">
            <h1>
                Zamówienie złożone i opłacone
            </h1>

            <div className="order-success-list-container">
                {products.map(p => (
                    <div key={p.productId} className="order-success-list-item">
                        <div className="order-success-list-item-desc">
                            <span>ID produktu: {p.productId}</span>
                            <span>Nazwa {p.name}</span>
                            <span>Ilość {p.quantity}</span>
                            <span>Cena za sztukę {getPriceAsText(p.price / 100)} zł</span>
                            <span>Kwota częściowa {getPriceAsText(p.amount_total / 100)} zł</span>
                        </div>
                        {p.imageIds && <img src={buildPublicUrl("/products/images/" + p.imageIds[0])} alt={p.name} />}
                    </div>
                ))}
            </div>
        </div>
    );
}
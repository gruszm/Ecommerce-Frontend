import "./OrderSuccess.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { buildGatewayUrl, buildPublicUrl, getPriceAsText } from "../../utils/api.js";

export default function OrderSuccess() {
    const [urlSearchParams] = useSearchParams();
    const sessionId = urlSearchParams.get("session_id");
    const [products, setProducts] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const sessionData = buildGatewayUrl(`/stripe/session/${sessionId}`);

        fetch(sessionData, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
        ).then(res => res.json()
        ).then(res => {
            setProducts(res.products); console.log(JSON.stringify(res));
        }
        ).catch(error => {
            setErrorMessage(error.message);
        });
    }, [sessionId]);

    if (!products) {
        return (
            <div>
                Ładowanie...
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div>
                Wystąpił błąd: {errorMessage}
            </div>
        );
    }

    return (
        <div className="order-success-container">
            <h1>
                Zamówienie złożone i opłacone
            </h1>

            <div className="order-success-list-container">
                {products?.map(p => (
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
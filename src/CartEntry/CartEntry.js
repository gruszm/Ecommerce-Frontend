import { buildPublicUrl } from "../utils/api";
import "./CartEntry.css";
import { useEffect, useState } from "react";

export default function CartEntry(props) {
    const [productData, setProductData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const url = buildPublicUrl(`/products/${props.entryData.productId}`);

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .then(response => {
                setProductData(response)
            })
            .catch(error => {
                setErrorMessage("Błąd pobierania danych produktu");
            });
    }, [props.entryData]);

    if (productData) {
        return (
            <div className="cart-entry-container">
                <p>Nazwa produktu: {productData.name}</p>
                <p>Cena: {productData.price}</p>
                <p>Ilość: {props.entryData.quantity}</p>
                <p>Kwota: {productData.price * props.entryData.quantity}</p>
            </div>
        );
    }
    else {
        return (
            <div className="cart-entry-container">
                <p>{errorMessage}</p>
            </div>
        );
    }
}
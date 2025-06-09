import { buildPublicUrl } from "../utils/api";
import "./CartEntry.css";
import { useEffect, useState } from "react";

function getSumAsText(price, quantity) {

    // Add a comma at the third to last position
    const sum = price * quantity;
    const sumAsText = (sum * 100).toString();
    const sumtAsTextWithDot = sumAsText.slice(0, -2) + "," + sumAsText.slice(-2);

    return sumtAsTextWithDot;
}

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
                <p>Cena: {productData.price} zł</p>
                <p>Ilość: {props.entryData.quantity}</p>
                <p>Kwota: {getSumAsText(productData.price, props.entryData.quantity)} zł</p>
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
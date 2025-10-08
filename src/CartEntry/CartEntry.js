import { buildPublicUrl } from "../utils/api";
import "./CartEntry.css";
import { useEffect, useState } from "react";

function getSumAsText(price, quantity) {

    // Add a comma at the third to last position
    const sum = price * quantity;
    const sumAsText = (sum * 100).toString();
    const sumAsTextWithComma = sumAsText.slice(0, -2) + "," + sumAsText.slice(-2);

    return sumAsTextWithComma;
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
                <div className="cart-entry-info">
                    <span>Nazwa produktu: {productData.name}</span>
                    <span>Cena: {getSumAsText(productData.price, 1)} zł</span>
                    <span>Ilość: {props.entryData.quantity}</span>
                    <span>Kwota: {getSumAsText(productData.price, props.entryData.quantity)} zł</span>
                </div>
                
                {(productData.imageIds.length > 0) &&
                    <img src={buildPublicUrl("/products/images/" + productData.imageIds[0])} alt={productData.name} />}
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
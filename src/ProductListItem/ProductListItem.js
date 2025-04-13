import "./ProductListItem.css";
import Cookies from "js-cookie";
import { useState } from "react";

export default function ProductListItem(props) {
    const [debug, setDebug] = useState("debug");

    function addToCart(event) {
        event.preventDefault();

        const token = Cookies.get("auth-token");
        const url = "http://" + process.env.REACT_APP_GATEWAY + ":" + process.env.REACT_APP_GATEWAY_PORT + "/api/secure/carts/" + props.productData.id + "/1";

        fetch(url, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        }).then(async res => {
            if (res.ok) {
                setDebug("Dodano do koszyka");
            } else {
                const errorResponse = await res.json();
                setDebug(errorResponse.message);
            }
        });
    }

    return (
        <div className="product-list-item-container">
            <div className="product-list-item-info">
                <p>name: {props.productData.name}</p>
                <p>price: {props.productData.price}</p>
                <p>amount: {props.productData.amount}</p>
                <p>categoryId: {props.productData.categoryId}</p>
                <p>{debug}</p>
            </div>
            <button className="add-to-cart" onClick={addToCart}>Dodaj do koszyka</button>
        </div>
    );
}
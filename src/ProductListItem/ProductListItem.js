import "./ProductListItem.css";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildPublicUrl, buildSecureUrl } from "../utils/api";

export default function ProductListItem(props) {
    const [addToCartMessage, setAddToCartMessage] = useState("");
    const navigate = useNavigate();

    function addToCart(event) {
        event.preventDefault();

        const token = Cookies.get("auth-token");

        if (!token) {
            navigate("/login");

            return;
        }

        const url = buildSecureUrl(`/carts/${props.productData.id}/1`);

        fetch(url, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        }).then(async res => {
            if (res.ok) {
                setAddToCartMessage("Dodano do koszyka");
            } else {
                const errorResponse = await res.json();
                setAddToCartMessage(errorResponse.message);
            }
        });
    }

    return (
        <div className="product-list-item-container">
            {(props.productData.imageIds.length > 0)
                && <img src={buildPublicUrl("/products/images/" + props.productData.imageIds[0])} alt={props.productData.name} className="product-first-image" />}
            <div className="product-list-item-info">
                <p>Nazwa: {props.productData.name}</p>
                <p>Cena: {props.productData.price} zł</p>
                <p>Ilość: {props.productData.amount}</p>
                {addToCartMessage && <p>{addToCartMessage}</p>}
            </div>
            <button className="add-to-cart" onClick={addToCart}>Dodaj do koszyka</button>
        </div>
    );
}
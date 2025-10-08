import "./Cart.css"
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CartEntry from "../CartEntry/CartEntry";
import { buildSecureUrl } from "../utils/api";
import { Link } from "react-router-dom";

export default function Cart(props) {
    const [loaded, setLoaded] = useState(false);
    const [cart, setCart] = useState(null);
    const [amount, setAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const cartUrl = buildSecureUrl("/carts/user");
        const token = Cookies.get("auth-token");

        fetch(cartUrl, {
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                setCart(res);
                setLoaded(true);
            })
            .catch(error => {
                setErrorMessage("Nie udało się załadować zawartości koszyka");
                setLoaded(true);
            });
    }, []);

    if (!loaded) {
        return <p>Ładowanie...</p>;
    }

    return (
        <div className="cart-container">
            <div className="cart-text">
                <p>Koszyk:</p>
            </div>

            {errorMessage === "" ? null : <p>{errorMessage}</p>}
            {cart !== null && cart.cartEntries.map(entry => <CartEntry key={entry.id} entryData={entry} />)}

            <div className="cart-info">
                <p>Razem: {amount} zł</p>
                
                {(cart?.cartEntries.length > 0) &&
                    <Link to="/select-address">Dostawa i płatność</Link>}
            </div>
        </div>
    );
}
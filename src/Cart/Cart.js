import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CartEntry from "../CartEntry/CartEntry";

export default function Cart(props) {
    const [loaded, setLoaded] = useState(false);
    const [cart, setCart] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const baseUrl = `http://${process.env.REACT_APP_GATEWAY}:${process.env.REACT_APP_GATEWAY_PORT}`;
        const cartUrl = baseUrl + "/api/secure/carts/user";
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
        <div>
            <p>Koszyk:</p>
            {errorMessage === "" ? null : <p>{errorMessage}</p>}
            {cart.cartEntries.map(entry => <CartEntry key={entry.id} entryData={entry} />)}
        </div>
    );
}
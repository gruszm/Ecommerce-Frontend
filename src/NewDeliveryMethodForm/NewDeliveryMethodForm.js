import "./NewDeliveryMethodForm.css";
import { buildSecureUrl } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";

export default function NewDeliveryMethodethodForm() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [errorMessage, setErrorMessage] = useState("empty error message");

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const url = buildSecureUrl("/delivery/");
        const token = Cookies.get("auth-token");
        const body = { method_name: name, price: price.replace(",", ".") };

        fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then(async res => {
            if (res.ok) {
                navigate("/admin-panel/delivery-method-management-panel");
            } else {
                const errorObject = await res.json();
                setErrorMessage(JSON.stringify(errorObject.message));
            }
        }).catch(error => {
            setErrorMessage("Dodawanie nowej metody dostawy nie powiodło się.");
        });
    };

    const handleNameChange = (event) => {
        const onlyLettersAndSpaces = /^[\p{L} ]*$/u; // Regex, which matches only Unicode letters and spaces, no digits or symbols
        const newName = event.target.value;          // New name

        // Allow longer name only if it does not contain any special character or digit
        if (newName.length < name.length || onlyLettersAndSpaces.test(newName)) {
            setName(newName);
        }
    };

    const handlePriceChange = (event) => {
        let newValue = event.target.value.replace(",", ".");

        // Check, if a new character was added
        if (newValue.length > price.length) {

            // Check, if the new value is a number
            if (!isNaN(parseFloat(newValue)) && isFinite(newValue)) {

                // Divide the number to the part before and after comma
                const priceParts = newValue.split(".");

                // Truncate the starting zeros to only 1 occurrence
                if (priceParts[0] && priceParts[0].startsWith("00")) {
                    priceParts[0] = "0";
                }

                // Truncate the number to 2 places after comma and set the value
                if (priceParts[1] && priceParts[1].length > 2) {
                    priceParts[1] = priceParts[1].substring(0, 2);
                }

                // Merge back the parts of the price after processing them
                newValue = priceParts[0] + (newValue.includes(".") ? "." : "") + (priceParts[1] || "");
            }
            // If the new value is not a number, then reset it to the current value
            else {
                newValue = price;
            }
        }

        setPrice(newValue.replace(".", ","));
    };

    return (
        <div className="new-delivery-method-form-container">
            <form onSubmit={handleSubmit} className="new-delivery-method-form">
                <span style={{ "marginBottom": "12px" }}>Dodawanie nowej metody dostawy</span>

                <div className="new-delivery-method-form-row">
                    <label htmlFor="delivery-method-name">Podaj nazwę:</label>
                    <input id="delivery-method-name" type="text" value={name} onChange={handleNameChange} placeholder="Nazwa metody" />
                </div>

                <div className="new-delivery-method-form-row">
                    <label htmlFor="delivery-method-price">Podaj cenę:</label>
                    <input id="delivery-method-price" type="text" value={price} onChange={handlePriceChange} placeholder="0,00" />
                </div>

                <button type="submit">Zatwiedź</button>
            </form>

            <p>{errorMessage}</p>
        </div>
    );
}
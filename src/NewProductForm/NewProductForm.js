import "./NewProductForm.css";
import { buildSecureUrl } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";

export default function NewProductForm() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState("");
    const [images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState("empty error message");

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        const url = buildSecureUrl("/products/");
        const token = Cookies.get("auth-token");

        formData.append("name", name);
        formData.append("price", price.replace(",", "."));
        formData.append("categoryId", 0);
        formData.append("amount", amount);

        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
        }

        fetch(url, {
            method: "POST",
            body: formData,
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.ok) {
                navigate("/admin-panel/product-management-panel");
            } else {
                setErrorMessage("Dodawanie nowego produktu nie powiodło się.");
            }
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

    const handleAmountChange = (event) => {
        const newValue = event.target.value; // New amount
        const isDigit = /^\d*$/;             // Regex used for checking if the amount only consists of digits
        const startsWithZero = /^0\d$/;      // Regex used for checking if the amount starts with '0' and another digit, e. g. "05"

        // Check, if a new character is added
        if (newValue.length > amount.length) {

            /* The new amount can only consist of digits and cannot start with '0'
               But can be exactly '0' */
            if (isDigit.test(newValue) && !startsWithZero.test(newValue)) {
                setAmount(newValue);
            }
        }
        // Otherwise, just set the new value
        else {
            setAmount(newValue);
        }
    };

    return (
        <div className="new-product-form-container">
            <form onSubmit={handleSubmit} className="new-product-form">
                <span style={{ "marginBottom": "12px" }}>Dodawanie nowego produktu</span>

                <div className="new-product-form-row">
                    <label htmlFor="product-name">Podaj nazwę:</label>
                    <input id="product-name" type="text" value={name} onChange={handleNameChange} placeholder="Nazwa produktu" />
                </div>

                <div className="new-product-form-row">
                    <label htmlFor="product-price">Podaj cenę:</label>
                    <input id="product-price" type="text" value={price} onChange={handlePriceChange} placeholder="0,00" />
                </div>

                <div className="new-product-form-row">
                    <label htmlFor="product-amount">Ilość początkowa:</label>
                    <input id="product-amount" type="text" value={amount} onChange={handleAmountChange} placeholder="0" />
                </div>

                <div className="new-product-form-row">
                    <label htmlFor="product-images">Zdjęcia produktu:</label>
                    <input type="file" id="product-images" multiple accept="image/*" onChange={e => setImages(e.target.files)} />
                </div>

                <button type="submit">Zatwiedź</button>
            </form>

            <p>{errorMessage}</p>
        </div>
    );
}
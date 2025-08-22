import "./NewAddressForm.css";
import { buildSecureUrl } from "../../utils/api";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function NewAddressForm(props) {
    const navigate = useNavigate();
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [apartmentNumber, setApartmentNumber] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");
    const [voivodeship, setVoivodeship] = useState("");
    const [country, setCountry] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const postalCodeRegex = /^\d{2}-?(?!000)\d{3}$/;
    const textRegex = /^[\p{L}\s-]*$/u;
    const numberRegex = /^[1-9][0-9]*$|^$/;

    const handleSubmit = (event) => {
        event.preventDefault();

        const url = buildSecureUrl("/profiles/addresses");
        const token = Cookies.get("auth-token");
        let formattedPostalCode;

        // Make sure to send the postal code in corrent form (with a dash on the 3rd position)
        if (postalCode.indexOf("-") === -1) {
            formattedPostalCode = postalCode.slice(0, 2) + "-" + postalCode.slice(2, 5);
        } else {
            formattedPostalCode = postalCode;
        }

        const address = {
            street,
            houseNumber,
            apartmentNumber,
            postalCode: formattedPostalCode,
            city,
            voivodeship,
            country
        };

        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            method: "POST",
            body: JSON.stringify(address)
        }).then(res => {
            if (res.ok) {
                navigate("/addresses", { replace: true });
            } else {
                res.json().then(parsed => setErrorMsg(parsed.message));
            }
        }).catch(err => {
            setErrorMsg(err.message);
        });
    }

    const handleChange = (event, setter, regex) => {
        const newValue = event.target.value;

        if (regex.test(newValue)) {
            setter(newValue);
        }
    };

    const handlePostalCodeChange = (event) => {
        const newValue = event.target.value;

        // There may not be any letters; dash must be at the 3rd position, not earlier and there may only be 1 dash
        if (/\p{L}/u.test(newValue) || /^(-|\d-)$/.test(newValue) || (newValue.match(/-/g) || []).length > 1) {
            return;
        }

        let numberOfDigits = 0;

        for (const character of newValue) {
            numberOfDigits += /^\d$/.test(character) ? 1 : 0;
        }

        // Check, if the postal code is filled
        if (numberOfDigits <= 5) {
            setPostalCode(newValue);

            if (postalCodeRegex.test(newValue)) {
                setSubmitDisabled(false);
            }
            else {
                setSubmitDisabled(true);
            }
        }
    };

    return (
        <div>
            <div className="new-address-form-container">
                <form className="new-address-form">
                    <span style={{ "marginBottom": "12px" }}>Dodawanie nowego adresu</span>

                    <div className="new-address-form-row">
                        <label htmlFor="address-street">Ulica:</label>
                        <input id="address-street" type="text" value={street} onChange={(event) => handleChange(event, setStreet, textRegex)} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-house-number">Numer budynku:</label>
                        <input id="address-house-number" type="text" value={houseNumber} onChange={(event) => handleChange(event, setHouseNumber, numberRegex)} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-apartment-number">Numer mieszkania:</label>
                        <input id="address-apartment-number" type="text" value={apartmentNumber} autoComplete="address-line2"
                            onChange={(event) => handleChange(event, setApartmentNumber, numberRegex)} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-postal-code">Kod pocztowy:</label>
                        <input id="address-postal-code" type="text" placeholder="00-000" value={postalCode} autoComplete="postal-code" onChange={handlePostalCodeChange} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-city">Miasto:</label>
                        <input id="address-city" type="text" value={city} autoComplete="address-level2" onChange={(event) => handleChange(event, setCity, textRegex)} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-voivodeship">Województwo:</label>
                        <input id="address-voivodeship" type="text" value={voivodeship} autoComplete="address-level1" onChange={(event) => handleChange(event, setVoivodeship, textRegex)} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-country">Kraj:</label>
                        <input id="address-country" type="text" value={country} autoComplete="country-name" onChange={(event) => handleChange(event, setCountry, textRegex)} />
                    </div>

                    <button type="submit" disabled={submitDisabled} onClick={handleSubmit} style={{ marginTop: "12px" }}>Zatwierdź</button>
                </form>

                <span>{errorMsg}</span>
            </div>
        </div>
    );
}
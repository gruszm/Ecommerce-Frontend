import "./NewAddressForm.css";
import { buildSecureUrl } from "../../utils/api";
import { MouseEvent, ChangeEvent, useReducer } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// Regexes
const postalCodeRegex = /^\d{2}-?(?!000)\d{3}$/;
const textRegex = /^[\p{L}\s-]*$/u;
const numberRegex = /^[1-9][0-9]*$|^$/;

// Form state utils
type FormState = {
    street: string,
    houseNumber: string,
    apartmentNumber: string,
    postalCode: string,
    city: string,
    voivodeship: string,
    country: string,
    errorMessage: string
};

type FormAction =
    | { type: "SET_FIELD", field: keyof Omit<FormState, "errorMessage">, value: string }
    | { type: "SET_ERROR", message: string }
    | { type: "RESET" };

const formInitialState: FormState = {
    street: "",
    houseNumber: "",
    apartmentNumber: "",
    postalCode: "",
    city: "",
    voivodeship: "",
    country: "",
    errorMessage: ""
};

function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                [action.field]: action.value
            };
        case "SET_ERROR":
            return {
                ...state,
                errorMessage: action.message
            };
        case "RESET":
            return formInitialState;
        default:
            const exhaustiveness: never = action;
            return state;
    }
}

export default function NewAddressForm() {
    // Hooks
    const navigate = useNavigate();
    const [formState, dispatch] = useReducer(formReducer, formInitialState);

    const isStreetValid = formState.street.length > 0 && textRegex.test(formState.street);
    const isHouseNumberValid = formState.houseNumber.length > 0 && numberRegex.test(formState.houseNumber);
    const isApartmentNumberValid = formState.apartmentNumber.length === 0 || numberRegex.test(formState.apartmentNumber);
    const isPostalCodeValid = postalCodeRegex.test(formState.postalCode);
    const isCityValid = formState.city.length > 0 && textRegex.test(formState.city);
    const isVoivodeshipValid = formState.voivodeship.length > 0 && textRegex.test(formState.voivodeship);
    const isCountryValid = formState.country.length > 0 && textRegex.test(formState.country);

    const formValid =
        isStreetValid &&
        isHouseNumberValid &&
        isApartmentNumberValid &&
        isPostalCodeValid &&
        isCityValid &&
        isVoivodeshipValid &&
        isCountryValid;

    // Handlers
    const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const url = buildSecureUrl("/profiles/addresses");
        const token = Cookies.get("auth-token");
        let formattedPostalCode: string;

        // Make sure to send the postal code in correct form (with a dash on the 3rd position)
        if (formState.postalCode.indexOf("-") === -1) {
            formattedPostalCode = formState.postalCode.slice(0, 2) + "-" + formState.postalCode.slice(2, 5);
        } else {
            formattedPostalCode = formState.postalCode;
        }

        const address = {
            street: formState.street,
            houseNumber: formState.houseNumber,
            apartmentNumber: formState.apartmentNumber,
            postalCode: formattedPostalCode,
            city: formState.city,
            voivodeship: formState.voivodeship,
            country: formState.country
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
                res.json().then((parsed: unknown) => {
                    if (parsed !== null && typeof parsed === "object" && "message" in parsed && typeof parsed.message === "string") {
                        dispatch({ type: "SET_ERROR", message: parsed.message })
                    }
                });
            }
        }).catch((err: unknown) => {
            if (err instanceof Error)
                dispatch({ type: "SET_ERROR", message: err.message });
        });
    }

    const handleChange = (field: keyof Omit<FormState, "errorMessage">, regex: RegExp) => (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        if (regex.test(newValue)) {
            dispatch({ type: "SET_FIELD", "field": field, "value": newValue });
        }
    };

    const handlePostalCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
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
            dispatch({ type: "SET_FIELD", field: "postalCode", value: newValue });
        }
    };

    // Front
    return (
        <div>
            <div className="new-address-form-container">
                <form className="new-address-form">
                    <span style={{ "marginBottom": "12px" }}>Dodawanie nowego adresu</span>

                    <div className="new-address-form-row">
                        <label htmlFor="address-street">Ulica:</label>
                        <input id="address-street" type="text" value={formState.street} onChange={handleChange("street", textRegex)} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-house-number">Numer budynku:</label>
                        <input id="address-house-number" type="text" value={formState.houseNumber} onChange={handleChange("houseNumber", numberRegex)} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-apartment-number">Numer mieszkania:</label>
                        <input id="address-apartment-number" type="text" value={formState.apartmentNumber} autoComplete="address-line2"
                            onChange={handleChange("apartmentNumber", numberRegex)} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-postal-code">Kod pocztowy:</label>
                        <input id="address-postal-code" type="text" placeholder="00-000" value={formState.postalCode} autoComplete="postal-code" onChange={handlePostalCodeChange} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-city">Miasto:</label>
                        <input id="address-city" type="text" value={formState.city} autoComplete="address-level2" onChange={handleChange("city", textRegex)} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-voivodeship">Województwo:</label>
                        <input id="address-voivodeship" type="text" value={formState.voivodeship} autoComplete="address-level1" onChange={handleChange("voivodeship", textRegex)} />
                    </div>

                    <div className="new-address-form-row">
                        <label htmlFor="address-country">Kraj:</label>
                        <input id="address-country" type="text" value={formState.country} autoComplete="country-name" onChange={handleChange("country", textRegex)} />
                    </div>

                    <button type="submit" disabled={!formValid} onClick={handleSubmit} style={{ marginTop: "12px" }}>Zatwierdź</button>
                </form>

                <span>{formState.errorMessage}</span>
            </div>
        </div>
    );
}
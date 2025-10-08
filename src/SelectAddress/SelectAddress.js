import { useState, useEffect } from "react";
import "./SelectAddress.css";
import Cookies from "js-cookie";
import { buildSecureUrl } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function SelectAddress(props) {
    const navigate = useNavigate();
    const [addressList, setAddressList] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const retrieveAddressListUrl = buildSecureUrl("/profiles/addresses");
        const token = Cookies.get("auth-token");

        fetch(retrieveAddressListUrl,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        ).then(res => res.json()
        ).then(parsedAddressList => {
            setAddressList(parsedAddressList);

            setLoading(false);
        }
        ).catch(error => {
            setErrorMsg(error.message);

            setLoading(false);
        });
    }, []);

    const navigateToSummary = (addressId) => {
        navigate("/order-summary", { state: { addressId } });
    };

    if (loading) {
        return (
            <p>Ładowanie listy adresów...</p>
        );
    }

    if (errorMsg) {
        return (
            <p>{errorMsg}</p>
        );
    }

    return (
        <div className="address-list-container">
            <p>Wybierz adres dostawy:</p>

            <div className="address-list-wrapper">
                <div className="address-list">
                    {addressList.map(a =>
                        <div key={a.id} className="address-single">
                            <span>{a.street} {a.houseNumber}{a.apartmentNumber ? `/${a.apartmentNumber}` : ""}</span>
                            <span>{a.city}, {a.postalCode}</span>
                            <span>{a.voivodeship}, {a.country}</span>
                            <button onClick={() => navigateToSummary(a.id)}>Wybierz</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
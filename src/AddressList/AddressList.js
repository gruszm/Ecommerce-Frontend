import "./AddressList.css"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { buildSecureUrl } from "../utils/api";

export default function AddressList(props) {
    const [addresses, setAddresses] = useState([]);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        const url = buildSecureUrl("/profiles/addresses");
        const token = Cookies.get("auth-token");

        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            method: "GET"
        }).then(res => {
            if (res.ok) {
                res.json().then(parsed => setAddresses(parsed));

            } else if (res.status === 404) {
                setErrMsg("Nie masz jeszcze żadnych adresów.");
            } else {
                res.json().then(parsed => setErrMsg(parsed.message));
            }
        }).catch(err => {
            setErrMsg(err.message);
        });
    }, []);

    return (
        <div className="address-list-container">
            <div className="address-list-header">
                <span className="address-list-text">Twoje adresy:</span>
                <Link to="new-address-form">Dodaj nowy adres</Link>
            </div>


            <div className="address-list-wrapper">
                <div className="address-list">
                    {addresses.map(a => (
                        <div key={a.id} className="address-single">
                            <span>{a.street} {a.houseNumber}{a.apartmentNumber ? `/${a.apartmentNumber}` : ""}</span>
                            <span>{a.city}, {a.postalCode}</span>
                            <span>{a.voivodeship}, {a.country}</span>
                        </div>
                    ))}
                </div>
            </div>

            <span>{errMsg}</span>
        </div>
    );
}
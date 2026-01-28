import { useState, useEffect } from "react";
import "./SelectAddress.css";
import Cookies from "js-cookie";
import { buildSecureUrl } from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import { isAddress, type Address } from "./types/Address.tsx";

export default function SelectAddress() {
    const navigate = useNavigate();
    const location = useLocation();
    const [addressList, setAddressList] = useState<Address[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

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
        ).then((parsedAddressList: unknown) => {
            // TODO: add handling - throw error
            if (!Array.isArray(parsedAddressList) || !parsedAddressList.every(isAddress)) {
                return;
            }

            setAddressList(parsedAddressList);
            setLoading(false);
        }
        ).catch((error: unknown) => {
            setLoading(false);

            if (error instanceof Error) {
                setErrorMsg(error.message);
            }
        });
    }, []);

    const navigateToSummary = (address: Address) => () => {
        navigate("/order-summary", {
            state:
            {
                addressId: address.id,
                deliveryMethodId: location?.state?.deliveryMethodId
            }
        });
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
                            <button onClick={navigateToSummary(a)}>Wybierz</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
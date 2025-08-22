import "./AddressList.css"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { buildSecureUrl } from "../utils/api";

const createMockAddresses = () => {
    const addresses = [];

    addresses.push({
        userId: 0,
        street: "Polna",
        houseNumber: 4,
        apartmentNumber: 2,
        postalCode: "99-123",
        city: "Warszawa",
        voivodeship: "Mazowieckie",
        country: "Polska"
    });

    addresses.push({
        userId: 0,
        street: "Lipowa",
        houseNumber: 12,
        apartmentNumber: 5,
        postalCode: "00-876",
        city: "Warszawa",
        voivodeship: "Mazowieckie",
        country: "Polska"
    });

    addresses.push({
        userId: 0,
        street: "Długa",
        houseNumber: 45,
        apartmentNumber: null,
        postalCode: "31-045",
        city: "Kraków",
        voivodeship: "Małopolskie",
        country: "Polska"
    });

    addresses.push({
        userId: 0,
        street: "Słoneczna",
        houseNumber: 8,
        apartmentNumber: 14,
        postalCode: "60-702",
        city: "Poznań",
        voivodeship: "Wielkopolskie",
        country: "Polska"
    });

    return addresses;
};

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

            {/* <table>
                <thead>
                    <tr>
                        <th>Ulica</th>
                        <th>Numer domu</th>
                        <th>Numer mieszkania</th>
                        <th>Kod pocztowy</th>
                        <th>Miasto</th>
                        <th>Województwo</th>
                        <th>Kraj</th>
                    </tr>
                </thead>
                <tbody>
                    {addresses.map(a => (
                        <tr key={a.id}>
                            <td>{a.street}</td>
                            <td>{a.houseNumber}</td>
                            <td>{a.apartmentNumber}</td>
                            <td>{a.postalCode}</td>
                            <td>{a.city}</td>
                            <td>{a.voivodeship}</td>
                            <td>{a.country}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    );
}
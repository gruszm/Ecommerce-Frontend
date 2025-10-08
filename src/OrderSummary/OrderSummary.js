import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSummary.css";
import { useState, useEffect } from "react";
import { buildGatewayUrl, buildPublicUrl, buildSecureUrl } from "../utils/api.js";
import Cookies from "js-cookie";
import OrderSummaryCartEntry from "./OrderSummaryCartEntry/OrderSummaryCartEntry.js";

export default function OrderSummary(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [selectedDeliveryMethodId, setSelectedDeliveryMethodId] = useState(null);
    const [selectedDeliveryMethodPrice, setSelectedDeliveryMethodPrice] = useState(0);
    const [addressData, setAddressData] = useState(null);
    const [cartEntries, setCartEntries] = useState([]);

    useEffect(() => {
        const token = Cookies.get("auth-token");

        if (!token) {
            navigate("login");
        }
        else {
            const fetchData = async () => {

                const addressId = location.state && location.state.addressId;
                const addressUrl = buildSecureUrl(`/profiles/addresses/${addressId}`);
                const deliveryMethodsUrl = buildPublicUrl("/delivery");
                const cartUrl = buildSecureUrl(`/carts/user`);
                let tempCartEntries = [];

                // Get the product IDs from the cart
                await fetch(cartUrl,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                ).then(res => res.json()
                ).then(res => {
                    tempCartEntries = res.cartEntries;
                }
                ).catch(error => {
                    setErrorMessage(error.message);
                    console.log(error.message);
                });

                // Retrieve the product data for each cart entry
                const productPromises = tempCartEntries.map(async entry => {
                    const productUrl = buildPublicUrl(`/products/${entry.productId}`);

                    const res = await fetch(productUrl,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );

                    return res.json();
                });

                const products = await Promise.all(productPromises);

                // Add the product data to each cart entry
                tempCartEntries = tempCartEntries.map((entry, index) => {
                    return {
                        ...entry,
                        name: products[index].name,
                        price: products[index].price,
                        imageIds: products[index].imageIds
                    };
                });

                setCartEntries(tempCartEntries);

                // Get the address picked in the previous step
                await fetch(addressUrl,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                ).then(res => res.json()
                ).then(res => {
                    setAddressData(res);
                }
                ).catch(error => {
                    setErrorMessage(error.message);
                    console.log(error.message);
                });

                // Get the delivery methods
                await fetch(deliveryMethodsUrl,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                ).then(res => res.json()
                ).then(res => {
                    if (res.length === 0) {
                        setErrorMessage("Błąd! Nie istnieje żadna opcja dostawy.");
                    }
                    else {
                        setDeliveryMethods(res);
                    }
                }
                ).catch(error => {
                    setErrorMessage(error.message);
                    console.log(error.message);
                });
            }

            fetchData();
        }
    }, [location.state, navigate]);

    const handleOrder = () => {
        const orderUrl = buildGatewayUrl("/order");
        const addressId = location.state && location.state.addressId;
        const body = { addressId };
        const token = Cookies.get("auth-token");

        if (!token) {
            navigate("login");

            return;
        }

        fetch(orderUrl,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        ).then(async res => {
            if (res.ok) {
                navigate("/");
            } else {
                const errorMessage = await res.json();

                setErrorMessage("Wystąpił błąd przy składaniu zamówienia: " + errorMessage)
            }
        }
        ).catch(error => {
            setErrorMessage("Wystąpił błąd przy składaniu zamówienia: " + error.message)
        });
    }

    let totalAmount = cartEntries.reduce((sum, entry) => sum + (entry.quantity * entry.price), 0);
    totalAmount += Number(selectedDeliveryMethodPrice);
    totalAmount = totalAmount.toFixed(2).replace(".", ",");

    return (
        <div className="order-summary-container">
            <h1>Podsumowanie zamówienia</h1>

            <div className="order-item-list">
                {cartEntries.map(entry => <OrderSummaryCartEntry key={entry.id} entryData={entry} />)}
            </div>

            <div className="address-info">
                <h2>Wybrany adres dostawy</h2>

                <div className="address-single">
                    {addressData &&
                        <>
                            <span>{addressData.street} {addressData.houseNumber}{addressData.apartmentNumber ? `/${addressData.apartmentNumber}` : ""}</span>
                            <span>{addressData.city}, {addressData.postalCode}</span>
                            <span>{addressData.voivodeship}, {addressData.country}</span>
                        </>
                    }
                </div>
            </div>

            <div className="order-delivery-method">
                <h2>Szczegóły dostawy</h2>

                <div className="order-delivery-method-info">
                    {errorMessage &&
                        <p>{errorMessage}</p>
                    }

                    <form>
                        {deliveryMethods.map(dm =>
                            <div key={dm.id}>
                                <input type="radio" name="delivery-method" id={dm.id} onChange={() => { setSelectedDeliveryMethodId(dm.id); setSelectedDeliveryMethodPrice(dm.price) }} />
                                <label htmlFor={dm.id}>{dm.name} {dm.price} zł</label>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div className="order-info">
                <p>Razem: {totalAmount} zł</p>

                <button disabled={selectedDeliveryMethodId === null || errorMessage} onClick={handleOrder}>
                    Zamawiam z obowiązkiem zapłaty
                </button>
            </div>
        </div>
    );
}
import "./DeliveryMethodManagementPanelList.css";
import { useState, useEffect } from "react";
import { buildPublicUrl } from "../../../utils/api";
import { isDeliveryMethod, type DeliveryMethod } from "../../../Cart/types/DeliveryMethod.tsx";

export default function DeliveryMethodManagementPanelList() {
    const [loading, setLoading] = useState<boolean>(true);
    const [deliveryMethodList, setDeliveryMethodList] = useState<DeliveryMethod[]>([]);
    const [errorOccured, setErrorOccured] = useState<boolean>(false);

    useEffect(() => {
        const url = buildPublicUrl("/delivery/");

        fetch(url,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false);

                if (Array.isArray(res) && res.length > 0 && res.every(isDeliveryMethod)) {
                    setDeliveryMethodList(res);
                }
            })
            .catch(() => {
                setLoading(false);
                setErrorOccured(true);
            });
    }, []);

    if (loading) {
        return <p>Ładowanie...</p>
    }

    if (errorOccured) {
        return <p>Błąd wczytywania listy metod dostawy.</p>
    }

    return (
        <table style={{ margin: "0 auto", borderSpacing: "100px 10px" }}>
            <thead>
                <tr>
                    <th>ID metody dostawy</th>
                    <th>Nazwa</th>
                    <th>Cena</th>
                </tr>
            </thead>

            <tbody className="table-body-centered">
                {deliveryMethodList.map(deliveryMethod =>
                    <tr key={deliveryMethod.id}>
                        <td>{deliveryMethod.id}</td>
                        <td>{deliveryMethod.name}</td>
                        <td>{deliveryMethod.price} zł</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
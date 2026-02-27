import "./ProductManagementPanelList.css";
import { useState, useEffect } from "react";
import { buildPublicUrl } from "../../../utils/api";
import { isProduct, type Product } from "../../../Cart/types/Product.tsx";

export default function ProductManagementPanelList() {
    const [loading, setLoading] = useState<boolean>(true);
    const [productList, setProductList] = useState<Product[]>([]);
    const [errorOccured, setErrorOccured] = useState<boolean>(false);

    useEffect(() => {
        const url = buildPublicUrl("/products");

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

                if (Array.isArray(res) && res.length > 0 && res.every(isProduct)) {
                    setProductList(res);
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
        return <p>Błąd wczytywania listy produktów.</p>
    }

    return (
        <table style={{ width: "100%" }}>
            <thead>
                <tr>
                    <th>ID produktu</th>
                    <th>Nazwa</th>
                    <th>Cena</th>
                    <th>Ilość</th>
                </tr>
            </thead>

            <tbody className="table-body-centered">
                {productList.map(product =>
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.price} zł</td>
                        <td>{product.amount}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
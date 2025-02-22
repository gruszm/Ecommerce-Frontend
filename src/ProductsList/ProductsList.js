import { useEffect, useState } from "react";
import "./ProductsList.css";
import ProductsListItem from "../ProductListItem/ProductListItem";

export default function ProductsList(props) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [productsList, setProductsList] = useState([]);

    useEffect(() => {
        const url = "http://" + process.env.REACT_APP_GATEWAY + ":" + process.env.REACT_APP_GATEWAY_PORT + "/api/public/products";

        fetch(url)
            .then(res => res.json())
            .then(res => {
                setLoading(false);
                setProductsList(res);
            })
            .catch(error => {
                setLoading(false);
                setError(true);
                setErrorMessage(error.message);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {errorMessage}</p>;

    return (
        <div>
            {productsList.map(singleProduct => <ProductsListItem key={singleProduct.id} productData={singleProduct} />)}
        </div>
    );
}
import { useEffect, useState } from "react";
import "./ProductList.css";
import ProductListItem from "../ProductListItem/ProductListItem";

export default function ProductList(props) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [ProductList, setProductList] = useState([]);

    useEffect(() => {
        const url = "http://" + process.env.REACT_APP_GATEWAY + ":" + process.env.REACT_APP_GATEWAY_PORT + "/api/public/products";

        fetch(url)
            .then(res => res.json())
            .then(res => {
                setLoading(false);
                setProductList(res);
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
        <div className="product-list-container">
            {ProductList.map(singleProduct => <ProductListItem key={singleProduct.id} productData={singleProduct} />)}
        </div>
    );
}